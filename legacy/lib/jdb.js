(function() {
  "use strict";
  var Criteria, CriteriaBuilder, Database, IDBCursor, IDBDatabase, IDBKeyRange, IDBTransaction, ObjectStore, ObjectStoreQuery, OpenDatabaseResult, StoreOperationResult, Transaction, Upgrade, UpgradeOperations, assert, capitalize, currentTransaction, executeInCurrentTransaction, extend, indexedDB, isFunction, isNullOrUndefined, prefixed, safeCall, slice, transactionNested, verifyParameterIsNotMissing, _global,
    __slice = Array.prototype.slice;

  _global = this;

  isFunction = function(obj) {
    return typeof obj === "function";
  };

  safeCall = function() {
    var args, fn, target;
    target = arguments[0], fn = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (typeof fn === "function") return fn.apply(target, args);
  };

  slice = Array.prototype.slice;

  assert = function(expr, errorMessage) {
    var e;
    if (!expr) {
      e = new Error;
      e.message = errorMessage;
      throw e;
    }
    return true;
  };

  verifyParameterIsNotMissing = function(paramName, param) {
    return assert(!isNullOrUndefined(param), "parameter [" + paramName + "] is required");
  };

  capitalize = function(s) {
    return s.charAt(0).toUpperCase() + s.substring(1);
  };

  extend = function(dest, src) {
    var key;
    for (key in src) {
      dest[key] = src[key];
    }
    return dest;
  };

  prefixed = function(name) {
    if (_global[name]) return _global[name];
    name = capitalize(name);
    return _global['webkit' + name] || _global['moz' + name] || _global['o' + name] || _global['ms' + name];
  };

  isNullOrUndefined = function(obj) {
    return obj === null || obj === void 0;
  };

  indexedDB = prefixed('indexedDB');

  IDBDatabase = prefixed('IDBDatabase');

  IDBCursor = prefixed('IDBCursor');

  IDBKeyRange = prefixed('IDBKeyRange');

  IDBTransaction = prefixed('IDBTransaction');

  OpenDatabaseResult = (function() {

    function OpenDatabaseResult(idbRequest) {
      this.idbRequest = idbRequest;
    }

    OpenDatabaseResult.prototype.error = function(callback) {
      this.idbRequest.addEventListener('error', callback, false);
      return this;
    };

    OpenDatabaseResult.prototype.success = function(callback) {
      this.idbRequest.addEventListener('success', callback, false);
      return this;
    };

    return OpenDatabaseResult;

  })();

  Upgrade = (function() {

    function Upgrade(oldVersion, newVersion) {
      this.oldVersion = oldVersion;
      this.newVersion = newVersion;
      this.ops = [];
    }

    Upgrade.prototype.getOperations = function(version) {
      var _base;
      return (_base = this.ops)[version] || (_base[version] = new UpgradeOperations(version));
    };

    Upgrade.prototype.execute = function(tx) {
      var op, _i, _len, _ref, _results;
      _ref = this.ops.slice(this.oldVersion, this.newVersion);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        op = _ref[_i];
        _results.push(op.execute(tx));
      }
      return _results;
    };

    return Upgrade;

  })();

  UpgradeOperations = (function() {

    function UpgradeOperations(version) {
      this.version = version;
      this.operations = [];
    }

    UpgradeOperations.prototype.createObjectStore = function(storeName, options) {
      var op;
      op = function(tx) {
        console.log("create object store:" + storeName + ", keyPath:" + options.keyPath + ", autoIncrement:" + options.autoIncrement);
        return tx.db.createObjectStore(storeName, options);
      };
      return this.operations.push(op);
    };

    UpgradeOperations.prototype.createIndex = function(storeName, indexName, keyPath, options) {
      var op;
      op = function(tx) {
        var objectStore;
        objectStore = tx.objectStore(storeName);
        console.log("create index:[storeName=" + storeName + "][indexName=" + indexName + "][keyPath=" + keyPath + "]");
        return objectStore.createIndex(indexName, keyPath, options);
      };
      return this.operations.push(op);
    };

    UpgradeOperations.prototype.execute = function(tx) {
      var op, _i, _len, _ref, _results;
      _ref = this.operations;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        op = _ref[_i];
        _results.push(op.execute(tx));
      }
      return _results;
    };

    return UpgradeOperations;

  })();

  Database = (function() {

    function Database(name, version) {
      this.name = name;
      this.version = version;
      verifyParameterIsNotMissing("name", name);
      verifyParameterIsNotMissing("version", version);
      assert(version > 0, "parameter [version] must be positive integer");
      this.stores = {};
    }

    Database.prototype.getStoreNames = function() {
      return Object.keys(this.stores);
    };

    Database.prototype.transaction = function(fn, options) {
      var mode;
      if (options == null) options = {};
      mode = options.mode || IDBTransaction.READ_WRITE;
      return executeInCurrentTransaction(fn, this, mode, options.stores, options.onAbort, options.onComplete, options.onError);
    };

    Database.prototype._upgrade = function(tx, oldVersion, newVersion) {
      var indexDef, indexName, keyDef, options, opts, since, storeDef, storeName, upgrade, _ref;
      console.log("oldVersion:" + oldVersion + " newVersion:" + newVersion);
      upgrade = new Upgrade();
      for (storeName in this.stores) {
        storeDef = this.stores[storeName];
        since = storeDef.since || 1;
        if (typeof since === 'number' && oldVersion < since && since <= newVersion) {
          keyDef = storeDef.key;
          options = {
            keyPath: keyDef.path,
            autoIncrement: keyDef.autoIncrement
          };
          upgrade.getOperations(since).createObjectStore(storeName, options);
        }
        _ref = storeDef.indexes;
        for (indexName in _ref) {
          indexDef = _ref[indexName];
          since = indexDef.since || storeDef.since || 1;
          if (typeof since === 'number' && oldVersion < since && since <= newVersion) {
            opts = {
              unique: !!indexDef.unique,
              multientry: !!indexDef.multientry
            };
            upgrade.getOperations(since).createIndex(storeName, indexName, indexDef.path, opts);
          }
        }
      }
      return upgrade.execute(tx);
    };

    Database.prototype.open = function(onSuccess, onError) {
      var r, self, successCallback;
      self = this;
      console.log("name:" + self.name + ",version:" + self.version);
      r = indexedDB.open(self.name, self.version);
      if (typeof onSuccess === "function") {
        successCallback = function() {
          var changeVersionReq, db, newVersion, oldVersion;
          db = self.idbDatabase = r.result;
          if (typeof db.setVersion === "function") {
            oldVersion = db.version ? parseInt(db.version, 10) : 0;
            newVersion = self.version;
            if (oldVersion === newVersion) {
              return onSuccess();
            } else {
              changeVersionReq = db.setVersion(newVersion);
              changeVersionReq.onsuccess = function() {
                console.log("using legacy API: IDBDatabase#setVersion()");
                self._upgrade(self.transaction, oldVersion, newVersion);
                return onSuccess();
              };
              return changeVersionReq.onerror = function() {
                return safeCall(null, onError, changeVersionReq.error);
              };
            }
          } else {
            return onSuccess();
          }
        };
        r.addEventListener("success", successCallback, false);
      }
      if (isFunction(onError)) r.addEventListener("error", onError, false);
      return r.onupgradeneeded = function(e) {
        var db, newVersion, oldVersion, tx;
        db = self.idbDatabase = r.result;
        tx = r.transaction;
        oldVersion = e.oldVersion || 0;
        newVersion = e.newVersion;
        self._upgrade(tx, oldVersion, newVersion);
        safeCall(self, onSuccess);
        return new OpenDatabaseResult(r);
      };
    };

    Database.prototype.defineObjectStore = function(params) {
      return new ObjectStore(this, params);
    };

    return Database;

  })();

  Transaction = (function() {

    function Transaction(database, mode, stores, onAbort, onComplete, onError) {
      var storeNames;
      this.database = database;
      this.mode = mode;
      this.stores = stores;
      this.onAbort = onAbort;
      this.onComplete = onComplete;
      this.onError = onError;
      storeNames = [];
      if (stores != null) {
        storeNames = slice.call(database.getStoreNames());
      } else {
        if (stores instanceof Array) {
          stores.forEach(function(store) {
            if (store(instnceof(ObjectStore))) {
              return storeNames.push(store.name);
            } else if (typeof store === 'string') {
              return storeNames.push(store);
            }
          });
        } else if (stores instanceof ObjectStore) {
          storeNames.push(stores.name);
        } else if (typeof stores === 'string') {
          storeNames.push(stores);
        } else {
          throw "could not process arguments[stores]:" + stores;
        }
      }
      this.storeNames = storeNames;
    }

    Transaction.prototype.begin = function() {
      var db, tx;
      db = this.database.idbDatabase;
      tx = this.idbTransaction = db.transaction(this.storeNames, this.mode);
      if (typeof this.onError === 'function') {
        tx.addEventListener('error', this.onError, false);
      }
      if (typeof this.onComplete === 'function') {
        tx.addEventListener('complete', this.onComplete, false);
      }
      if (typeof this.onAbort === 'function') {
        tx.addEventListener('abort', this.onAbort, false);
      }
      return this.active = true;
    };

    Transaction.prototype.abort = function() {
      if (!this.active) throw "Transaction is not active";
      return this.idbTransaction.abort();
    };

    Transaction.prototype.execute = function(fn) {
      this.begin();
      try {
        return fn(this);
      } catch (e) {
        this.abort();
        throw e;
      }
    };

    return Transaction;

  })();

  currentTransaction = null;

  transactionNested = 0;

  executeInCurrentTransaction = function(fn, database, mode, stores, onAbort, onComplete, onError) {
    currentTransaction || (currentTransaction = new Transaction(database, mode, stores, onAbort, onComplete));
    transactionNested++;
    try {
      return currentTransaction.execute(fn);
    } finally {
      if (--transactionNested === 0) currentTransaction = null;
    }
  };

  ObjectStoreQuery = (function() {

    function ObjectStoreQuery(store) {
      this.store = store;
      this.filters = [];
    }

    ObjectStoreQuery.prototype.criteria = function(criteria) {
      this._criteria = criteria;
      return this;
    };

    ObjectStoreQuery.prototype.filter = function(filter) {
      this.filters.push(filter);
      return this;
    };

    ObjectStoreQuery.prototype._getData = function(onContinue, onError, onEnd) {
      var criteria, filters, proc, self;
      self = this;
      filters = this.filters;
      criteria = this._criteria;
      proc = function(tx) {
        var cursorReq, idbObjectStore;
        idbObjectStore = tx.idbTransaction.objectStore(self.store.name);
        cursorReq = null;
        if (criteria) {
          cursorReq = criteria.createCursor(idbObjectStore);
        } else {
          cursorReq = idbObjectStore.openCursor();
        }
        cursorReq.onsuccess = function() {
          var cursor, filter, ret, value, _i, _len;
          cursor = cursorReq.result;
          if (!cursor) {
            if (typeof onEnd === "function") onEnd();
            return;
          }
          value = cursor.value;
          for (_i = 0, _len = filters.length; _i < _len; _i++) {
            filter = filters[_i];
            if (!filter(value)) {
              cursor["continue"]();
              return;
            }
          }
          ret = onContinue(value);
          if (ret !== false) return cursor["continue"]();
        };
        return cursorReq.onError = function() {
          return onError(void 0, cursorReq.error);
        };
      };
      return executeInCurrentTransaction(proc, this.store.database, IDBTransaction.READ_ONLY, this.store);
    };

    ObjectStoreQuery.prototype.iterate = function(callback) {
      return this._getData(callback, callback);
    };

    ObjectStoreQuery.prototype.list = function(callback) {
      var results;
      results = [];
      return this._getData(function(value) {
        return results.push(value);
      }, function(error) {
        return callback(void 0, error);
      }, function() {
        return callback(results);
      });
    };

    return ObjectStoreQuery;

  })();

  StoreOperationResult = (function() {

    function StoreOperationResult(idbRequest) {
      this.idbRequest = idbRequest;
    }

    StoreOperationResult.prototype.error = function(callback) {
      this.idbRequest.addEventListener("error", callback, false);
      return this;
    };

    StoreOperationResult.prototype.success = function(callback) {
      var req;
      req = this.idbRequest;
      req.addEventListener("success", function() {
        return callback(req.result);
      }, false);
      return this;
    };

    return StoreOperationResult;

  })();

  Criteria = (function() {

    function Criteria() {
      this.direction = "next";
      this.allowDuplicate = true;
    }

    Criteria.prototype.equal = function(val) {
      this.only = val;
      return this;
    };

    Criteria.prototype.le = function(val) {
      this.upper = val;
      this.upperOpen = false;
      return this;
    };

    Criteria.prototype.lt = function(val) {
      this.upper = val;
      this.upperOpen = true;
      return this;
    };

    Criteria.prototype.ge = function(val) {
      this.lower = val;
      this.lowerOpen = false;
      return this;
    };

    Criteria.prototype.ge = function(val) {
      this.lower = val;
      this.lowerOpen = true;
      return this;
    };

    Criteria.prototype.dir = function(direction) {
      if (direction !== "next" && direction !== "prev") {
        throw "Invalid direction: " + direction + " (must be 'next' or 'prev')";
      }
      this.direction = direction;
      return this;
    };

    Criteria.prototype.dup = function(allowDuplicate) {
      this.allowDuplicate = !allowDuplicate;
      return this;
    };

    Criteria.prototype.toKeyRange = function() {
      var keyRange;
      keyRange = null;
      if (this.only) {
        keyRange = IDBKeyRange.only(this.only);
      } else {
        if (!isNullOrUndefined(this.upper)) {
          if (!isNullOrUndefined(this.lower)) {
            keyRange = IDBKeyRange.bound(this.lower, this.upper, this.lowerOpen, this.upperOpen);
          } else {
            keyRange = IDBKeyRange.upperBound(this.upper, this.upperOpen);
          }
        } else if (!isNullOrUndefined(this.lower)) {
          keyRange = IDBKeyRange.lowerBound(this.lower, this.lowerOpen);
        }
      }
      return keyRange;
    };

    Criteria.prototype.createCursor = function(idbObjectStore) {
      var direction, keyRange;
      keyRange = this.toKeyRange();
      direction = null;
      if (this.direction === "next") {
        if (this.allowDuplicate) {
          direction = IDBKeyRange.NEXT;
        } else {
          direction = IDBKeyRange.NEXT_NO_DUPLICATE;
        }
      } else {
        if (this.allowDuplicate) {
          direction = IDBKeyRange.PREV;
        } else {
          direction = IDBKeyRange.PREV_NO_DUPLICATE;
        }
      }
      if (this.byKey) {
        return idbObjectStore.openCursor(keyRange, direction);
      } else {
        return idbObjectStore.index(this.indexName).openCursor(keyRange, direction);
      }
    };

    return Criteria;

  })();

  CriteriaBuilder = (function() {

    function CriteriaBuilder() {}

    CriteriaBuilder.byKey = function() {
      var criteria;
      criteria = new Criteria;
      criteria.byKey = true;
      return criteria;
    };

    CriteriaBuilder.byIndex = function(indexName) {
      var criteria;
      criteria = new Criteria;
      criteria.indexName = indexName;
      return criteria;
    };

    return CriteriaBuilder;

  })();

  ObjectStore = (function() {

    function ObjectStore(database, params) {
      this.database = database;
      verifyParameterIsNotMissing("database", this.database);
      verifyParameterIsNotMissing("params", params);
      this.name = params.name, this.key = params.key, this.indexes = params.indexes, this.since = params.since;
      assert(typeof this.name === "string" && this.name.length > 0, "parameter [name] must be non-empty string");
      assert(typeof this.key === "object" && (this.key.path != null), "parameter [key] must be object which has 'path' property");
      if (this.indexes == null) this.indexes = [];
      assert(this.indexes instanceof Array, "parameter [indexes] must be an Array");
      this.database.stores[this.name] = this;
    }

    ObjectStore.prototype._exec = function(proc, callback, txMode) {
      var self, txProc;
      self = this;
      txProc = function(tx) {
        var idbObjectStore, r;
        idbObjectStore = tx.idbTransaction.objectStore(self.name);
        r = proc(tx, idbObjectStore);
        if (typeof callback === "function") {
          r.addEventListener("success", function() {
            return callback(r.result, false);
          });
          r.addEventListener("error", function() {
            callback(void 0, r.error);
            return false;
          });
        }
        return new StoreOperationResult(r);
      };
      return executeInCurrentTransaction(txProc, this.database, txMode, self);
    };

    ObjectStore.prototype.remove = function(key, callback) {
      return this._exec(function(tx, idbObjectStore) {
        return idbObjectStore["delete"](key);
      }, callback, IDBTransaction.READ_WRITE);
    };

    ObjectStore.prototype.clear = function(callback) {
      return this._exec(function(tx, idbObjectStore) {
        return idbObjectStore.clear();
      }, callback, IDBTransaction.READ_WRITE);
    };

    ObjectStore.prototype.put = function(obj, callback) {
      return this._exec(function(tx, idbObjectStore) {
        return idbObjectStore.put(obj);
      }, callback, IDBTransaction.READ_WRITE);
    };

    ObjectStore.prototype.get = function(key, callback) {
      return this._exec(function(tx, idbObjectStore) {
        return idbObjectStore.get(key);
      }, callback, IDBTransaction.READ_WRITE);
    };

    ObjectStore.prototype.all = function() {
      return new ObjectStoreQuery(this);
    };

    ObjectStore.prototype.criteria = function(criteria) {
      return new ObjectStoreQuery(this).criteria(criteria);
    };

    ObjectStore.prototype.filter = function(filter) {
      return new ObjectStoreQuery(this).filter(filter);
    };

    return ObjectStore;

  })();

  _global.indexedDB = prefixed("indexedDB");

  _global.IDBDatabase = prefixed("IDBDatabase");

  _global.IDBCursor = prefixed("IDBCursor");

  _global.IDBKeyRange = prefixed("IDBKeyRange");

  _global.IDBTransaction = prefixed("IDBTransaction");

  _global.JDBDatabase = Database;

  _global.JDBCriteria = CriteriaBuilder;

}).call(this);
