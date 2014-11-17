//*********************************************************************************************************
//ixDbEz -     IndexedDB EZ is a js wrapper for IndexedDB providing rapid client-side development
//             of IndexedDB databases.
//
// Copyright (C) 2012 - Jake Drew
// Dual licensed under the MIT and GPL licenses.
//  - http://www.opensource.org/licenses/mit-license.php
//  - http://www.gnu.org/copyleft/gpl.html
//
//Created By - Jake Drew 
//Version -    1.0, 07/16/2012
//*********************************************************************************************************
var ixDbEz = (function () {
    //Populate the window.indexedDB variables with the appropriate browser specific instance.  
    window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange || window.msIDBKeyRange;

    var ixDb; //The current ixdb database instance being accessed in all functions below.
    var ixDbRequest; //The current ixdb request instance being accessed in all functions below.
    var ixDbVersionTansaction; //Holds a reference to a versionchange transaction object anytime a version change is in process.

    //*********************************************************************************************************
    //Function StartDB - Open or create the requested database and populate the variable ixDb with the new IndexedDB instance.
    //           dbName - Name of the IndexedDB database to open or create
    //        dbVersion - MUST be a valid integer. If not, the database is given a version number = 1.
    //          ixdbDDL - javascript var that contains a function with all the IndexedDB's valid ixDbEz DDL calls (see usage example)
    //        onSuccess - (optional) callback function to execute if function successful.
    //          onError - (optional) callback function to execute if function fails.
    //*********************************************************************************************************
    function StartDB_(dbName, dbVersion, ixdbDDL, onSuccess, onError) {
        //Check to see if we have a browser that supports IndexedDB
        if (window.indexedDB) {

            ixDbRequest = window.indexedDB.open(dbName, dbVersion);

            ixDbRequest.onsuccess = function (e) {
                ixDb = ixDbRequest.result || e.result;  // FF4 requires e.result.

                //Check to see if a database upgrade is required.
                //This logic should work with Chrome until they catch up with Firefox and support onupgradeneeded event. 
                //Also works on older browsers builds that still support setVersion
                if (typeof ixDb.setVersion === "function") {

                    var oldVersion = parseInt(ixDb.version || -1001);
                    oldVersion = isNaN(oldVersion) || oldVersion == null ? -1001 : oldVersion;
                    var newVersion = parseInt(dbVersion || 1);
                    newVersion = isNaN(newVersion) || newVersion == null ? 1 : newVersion;

                    if (oldVersion < newVersion) {
                        var verRequest = ixDb.setVersion(newVersion);

                        verRequest.onerror = ixDbEz.onerror;

                        verRequest.onsuccess = function (e) {
                            //log successful database creation
                            console.log('ixDbEz: Created Database: ' + dbName + ',  Version: ' + newVersion + '.')
                            //Get a reference to the version transaction from the old setVersion method.
                            ixDbVersionTansaction = verRequest.result;
                            //Create database using function provided by the user. 
                            ixdbDDL();
                        }
                    }
                    else {
                        //log successful database open
                        console.log('ixDbEz: Opened Database: ' + dbName + ',  Version: ' + newVersion + '.')
                    }
                }
                
                //destroy the version trasaction variable (since version change transactions lock the database)
                delete ixDbVersionTansaction;

                //execute onsuccess function, if one was provided 
                if(typeof onSuccess === 'function') { 
                        onSuccess(); 
                }

            };

            ixDbRequest.onerror = function (e) {
                logError(e, onError, ixDbVersionTansaction);
            };

            //The onupgradeneeded event is not yet supported by Chrome and requires a hook in the onsuccess event above.
            ixDbRequest.onupgradeneeded = function (e) {
                //FF uses this event to fire DDL function for upgrades.  All browsers will eventually use this method. Per - W3C Working Draft 24 May 2012
                ixDb = ixDbRequest.result || e.currentTarget.result;
                //Get a reference to the version transaction via the onupgradeneeded event (e)
                ixDbVersionTansaction = e.currentTarget.transaction;
                //Create database using function provided by the user.
                ixdbDDL();
                //destroy the version trasaction variable (since version change transactions lock the database)
                delete ixDbVersionTansaction;
            };
        }
    }

    //*********************************************************************************************************
    //Function CreateObjStore - Create IndexedDB object store (similar to a table)
    //       objectStoreName - Name of the Object Store / Table "MyOsName"
    //                 pkName - Keypath name (Similar to Primary Key)
    //          autoIncrement - true or false (assigns an autonumber to the primary key / Keypath value)
    //                          Default value = false.
    //        onSuccess - (optional) callback function to execute if function successful.
    //          onError - (optional) callback function to execute if function fails. 
    //*********************************************************************************************************
    function CreateObjStore_(objectStoreName, pkName, autoIncrement, onSuccess, onError) {
        //Create a default value for the autoIncrement variable
        autoIncrement = typeof autoIncrement === 'undefined' ? false : autoIncrement;

        try {
            if (pkName == null || autoIncrement == null)
                var objectStore = ixDb.createObjectStore(objectStoreName, null);
            else
                var objectStore = ixDb.createObjectStore(objectStoreName, { keyPath: pkName, autoIncrement: autoIncrement });
            
            //execute onsuccess function, if one was provided 
            if(typeof onSuccess === 'function') { 
                    onSuccess(); 
            }

            //Log os creation. onsuccess does not fire for objectStore!
            console.log('ixDbEz: Created ObjectStore ' + objectStoreName + '.');
        } catch (e) {
            logError(e, onError, ixDbVersionTansaction);
        }
        return objectStore;
    }

    //*********************************************************************************************************
    //Function CreateIndex - Create IndexedDB object store index (similar to a table index on a field)
    //     objectStoreName - Name of the Object Store / Table "MyOsName"   
    //              ixName - Name of the Index to create
    //           fieldName - Keypath name to add the index too.  (Can the name of any property / field in the object store)
    //              unique - true or false, if True - all values in the index must be unique.
    //                       Default value = false.
    //          multiEntry - true or false, see w3 documentation: http://www.w3.org/TR/IndexedDB/#dfn-multientry
    //                       Default value = false.
    //        onSuccess - (optional) callback function to execute if function successful.
    //          onError - (optional) callback function to execute if function fails.
    //*********************************************************************************************************
    function CreateIndex_(objectStoreName, ixName, fieldName, unique, multiEntry, onSuccess, onError) {

        //Create a default value for the autoIncrement variable
        unique = typeof unique === 'undefined' ? false : unique;
        multiEntry = typeof multiEntry === 'undefined' ? false : multiEntry;

        try {
            var ObjectStore = ixDbVersionTansaction.objectStore(objectStoreName);
            var index = ObjectStore.createIndex(ixName, fieldName, { unique: unique, multiEntry: multiEntry });

            //execute onsuccess function, if one was provided 
            if(typeof onSuccess === 'function') { 
                    onSuccess(); 
            }

            //Log index creation. onsuccess does not fire for index!
            console.log('ixDbEz: Created index: ' + ixName + ' against keypath: ' + fieldName + '.');
        } catch (e) {
            logError(e, onError, ixDbVersionTansaction);
        }
    }

    //*********************************************************************************************************
    //Function Add      - Insert a record into an object store.
    //  objectStoreName - Name of the Object Store / Table "MyOsName"   
    //            value - Record object or value to insert. 
    //              key - (optional) Key to access record.
    //        onSuccess - (optional) callback function to execute if function successful.
    //          onError - (optional) callback function to execute if function fails.
    //*********************************************************************************************************
    function Add_(objectStoreName, value, key, onSuccess, onError) {
        if (ixDb) {
            var transaction = ixDb.transaction(objectStoreName, IDBTransaction.READ_WRITE);
            var objectStore = transaction.objectStore(objectStoreName);
            
            request = typeof key === 'undefined' ? objectStore.add(value) : objectStore.add(value, key);

            request.onsuccess = function (e) {    
                if(typeof onSuccess === 'function') { 
                    onSuccess(); 
                }
                console.log('ixDbEz: Created record in ObjectStore ' + objectStoreName + ".");                         
            };
         
            request.onerror = function (e) { 
                if(typeof onError === 'function') { 
                    onError(); 
                }
                console.log('ixDbEz Error: Create record in ObjectStore ' + objectStoreName + " failed.");
                logError(e);
            }
        }
        else { 
            if (ixDbRequest) {
                ixDbRequest.addEventListener ("success", function() { Add_(objectStoreName, value, key, onSuccess, onError); }, false);
            }
        }
    }

    //*********************************************************************************************************
    //Function Put      - Replace or insert a record in an object store.
    //  objectStoreName - Name of the Object Store / Table "MyOsName"   
    //            value - Record object or value to insert. 
    //              key - (optional) Key to access record.
    //        onSuccess - (optional) callback function to execute if function successful.
    //          onError - (optional) callback function to execute if function fails.
    //*********************************************************************************************************
    function Put_(objectStoreName, value, key, onSuccess, onError) {
        if (ixDb) {
            var transaction = ixDb.transaction(objectStoreName, IDBTransaction.READ_WRITE);
            var objectStore = transaction.objectStore(objectStoreName);
            
            request = typeof key === 'undefined' ? objectStore.put(value) : objectStore.put(value, key);

            request.onsuccess = function (e) {
                if(typeof onSuccess === 'function') { 
                    onSuccess(); 
                }
                console.log('ixDbEz: Put record into ObjectStore ' + objectStoreName + ".");                        
            };

            request.onerror = function (e) { 
                if(typeof onError === 'function') { 
                    onError(); 
                }
                console.log('ixDbEz Error: Put record into ObjectStore ' + objectStoreName + " failed."); 
                logError(e);
            }
        }
        else {
            if (ixDbRequest) {
                ixDbRequest.addEventListener ("success", function() { Put_(objectStoreName, value, key, onSuccess, onError); }, false);
            }
        }
    }

    //*********************************************************************************************************
    //Function updateKey - Replace or insert a record in an object store.
    //   objectStoreName - Name of the Object Store / Table "MyOsName"   
    //            oldKey - The Key value that needs to be updated. 
    //            newKey - New value for the oldKey.
    //         onSuccess - (optional) callback function to execute if function successful.
    //           onError - (optional) callback function to execute if function fails.
    //
    //   newKey Warning! - If newKey exists in the ObjectStore, it's value will be replaced by oldKey.value
    //*********************************************************************************************************
    function UpdateKey_(objectStoreName, oldKey, newKey, onSuccess, onError) {
        if (ixDb) {
            var keyInObject = false;
            var transaction = ixDb.transaction(objectStoreName, IDBTransaction.READ_WRITE);
            var objectStore = transaction.objectStore(objectStoreName);

            //Check oldKey exists request
            var request = objectStore.get(oldKey);

            request.onsuccess = function (e) {
                //Get the value from the oldKey record
                var oldKeyResult = e.result||this.result; 

                //oldKey provided does not exist in database.
                if(typeof oldKeyResult === 'undefined'){
                    console.log('ixDbEz Error: updateKey failed. Key: ' + oldKey + ' does not exist in ObjectStore '  + objectStoreName + "."); 
                }
                //oldKey provided does exist in the database 
                else {
                    //if the value in the oldKey record is an object, and that object contains a 
                    //property that matches the current ObjectStore's KeyPath name, update that property 
                    //with the newKey value.
                    if(typeof oldKeyResult === 'object' && containsProperty(oldKeyResult, objectStore.keyPath)){
                        oldKeyResult[objectStore.keyPath] = newKey;
                        //since the newKey was updated in the object, newKey variable must = undefined
                        //or add_ and put_ will fail. keyInObject is checked later to set newKey = undefined
                        keyInObject = true;   
                    }

                    //delete oldKey request
                    var request = objectStore.delete(oldKey);

                    request.onsuccess = function (e) {
                        
                        //check newKey exists request
                        var request = objectStore.get(newKey);
                    
                        request.onsuccess = function (e) { 
                            var newKeyResult = e.result || this.result;

                            //newKey provided does not exist in database, so a new record is added
                            if(typeof newKeyResult === 'undefined'){
                                if(keyInObject){
                                    Add_(objectStoreName, oldKeyResult, undefined , onSuccess, onError);
                                }
                                else{
                                    Add_(objectStoreName, oldKeyResult, newKey, onSuccess, onError);
                                }    
                            }
                            //newKey does exist in database, and it's value is replaced.
                            else {
                                if(keyInObject){
                                    Put_(objectStoreName, oldKeyResult, undefined , onSuccess, onError);
                                }
                                else{
                                    Put_(objectStoreName, oldKeyResult, newKey, onSuccess, onError);
                                } 
                            } //else - newKey exists
                        } //check newKey.onsuccess 
                        
                        //check newKey failed
                        request.onerror = function (e) {
                            var errEvent = e.result||this.result;
                            logError(errEvent, onError); 
                            console.log('ixDbEz Error: updateKey failed. Key: ' + newKey + ' is not valid in ObjectStore: '  + objectStoreName + ".");
                        }    
                             
                    } //delete oldKey.onsuccess 

                    //delete oldKey failed
                    request.onerror = function (e) {
                        var errEvent = e.result||this.result;
                        logError(errEvent, onError); 
                        console.log('ixDbEz Error: updateKey failed. Could not delete Key: ' + oldKey + ' from ObjectStore: '  + objectStoreName + ".");
                    }

                }  //else - oldKey exists                               
            } //check oldKey.onsuccess
            
            //check oldKey failed
            request.onerror = function (e) {
                var errEvent = e.result||this.result;
                logError(errEvent, onError); 
                console.log('ixDbEz Error: updateKey failed. Key: ' + oldKey + ' is not valid in ObjectStore: '  + objectStoreName + ".");

            }

        } // ixDb exists
        else{
            if (ixDbRequest) {
                ixDbRequest.addEventListener ("success", function() { UpdateKey_(objectStoreName, oldKey, newKey, onSuccess, onError); }, false);
            }
        }
    } // function

    //*********************************************************************************************************
    //Function Delete   - Delete a record in an object store.
    //  objectStoreName - Name of the Object Store / Table "MyOsName"   
    //              key - Key of the record to be deleted.
    //        onSuccess - (optional) callback function to execute if function successful.
    //          onError - (optional) callback function to execute if function fails.
    //*********************************************************************************************************
    function Delete_(objectStoreName, key, onSuccess, onError) {
        if (ixDb) {
            var transaction = ixDb.transaction(objectStoreName, IDBTransaction.READ_WRITE);
            var objectStore = transaction.objectStore(objectStoreName);

            request = objectStore.delete(key);

            request.onsuccess = function (e) {
                if(typeof onSuccess === 'function') { 
                    onSuccess(); 
                }
                console.log('ixDbEz: Deleted record key: ' + key + ' from ObjectStore ' + objectStoreName + ".");                          
            };

            request.onerror = function (e) { 
                if(typeof onError === 'function') { 
                    onError(); 
                }
                console.log('ixDbEz: Deleted record key: ' + key + ' from ObjectStore ' + objectStoreName + " failed."); 
                logError(e);
            }
        }
        else{
            if (ixDbRequest) {
                ixDbRequest.addEventListener ("success", function() { Delete_(objectStoreName, key, onSuccess, onError); }, false);
            }
        }
    }

    //*********************************************************************************************************
    //Function getCursor - Returns a cursor for the requested ObjectStore
    //  objectStoreName  - Name of the Object Store / Table "MyOsName" 
    //         onSuccess - Name of the function to call and pass the cursor request back to upon 
    //                      successful completion.
    //           onError - (optional) callback function to execute if function fails. 
    // 
    //     onSuccess Ex. - getCursor_("ObjectStore_Name", MyCallBackFunction);
    //                      !! onSuccess function definition must have input variable for the request object !!
    //  
    //                      Function MyCallBackFunction(CursorRequestObj) { 
    //                                   CursorRequestObj.onsuccess = function() {//do stuff here};
    //                      }
    //
    //*********************************************************************************************************
    function getCursor_(objectStoreName, onSuccess, onError) {
        //The the openCursor call is asynchronous, so we must check to ensure a database 
        //connection has been established and then provide the cursor via callback. 
        if (ixDb) {
            var transaction = ixDb.transaction(objectStoreName, IDBTransaction.READ_ONLY);
            var objectStore = transaction.objectStore(objectStoreName); 
            try{
                var request = objectStore.openCursor(); 
                onSuccess(request);
                console.log('ixDbEz: Getting cursor request for ' + objectStoreName + ".");
            }
            catch(e){
                onError();
                console.log('ixDbEz Error' + ' getCursor:(' + e.code + '): ' + e.message);
            } 
        }
        else { 
            if (ixDbRequest) {
                ixDbRequest.addEventListener ("success", function() { getCursor_(objectStoreName, onSuccess, onError); }, false);
            }
        }
    }
    

    return {
        startDB: StartDB_,
        createObjStore: CreateObjStore_,
        createIndex: CreateIndex_,
        add : Add_,
        put : Put_,
        delete : Delete_,
        getCursor: getCursor_, 
        updateKey : UpdateKey_
    }
})();

//default console error handler
ixDbEz.onerror = function () { logError(e) }; 

//*********************************************************************************************************
//Function logError - Writes all errors to console.log
//         errEvent - event objects or and other javascript object which contains a errEvent.code   
//                      and errEvent.message property.
//          onError - (optional) callback function to execute if function fails. 
//
//              Tip - Re-route any Console.log messages to whereever you want. (div file etc...)
//                      window.console.log = function (msg) { //your code here } 
//*********************************************************************************************************
function logError(errEvent, onError, transaction) {
    //if a valid onError function was passed, execute it.
    if(typeof onError === 'function') { 
        onError(); 
    }
    //if a transaction object was passed, attempt to abort it
    if(transaction.constructor.name == "IDBTransaction") { 
        transaction.abort();
    }
    console.log('ixDbEz Error' + '(' + errEvent.code + '): ' + errEvent.message + '.');
}

//*********************************************************************************************************
//Function containsProperty - Returns true if the object contains the requested property, otherwise false. 
//                   object - A valid javascript object.
//                 property - A string with the requested property name.
//*********************************************************************************************************
function containsProperty(object, property){
    var prototype = object.__prototype__ || object.constructor.prototype;
    return (property in object) && (!(property in prototype) 
         || prototype[property] !== object[property]);
}