class window.Nar

  constructor: ->

  load: (url, callback)->
    urlToBlob url, (blob)=>
      unzip blob, (hash)=>
        filetree hash, (obj)=>
          callback(_.extend @, obj)

  urlToBlob = (url, next) ->
    error = (ev)-> next(false)
    unless url then return setTimeout(error)
    absUrl = mm.url.resolve(url)
    unless absUrl.isURL() then return setTimeout(error)
    xhr = new XMLHttpRequest
    xhr.open("GET", absUrl, true)
    xhr.responseType = "blob"
    xhr.error = error
    xhr.onload = (ev)->
      if xhr.status is 200 then next(xhr.response)
      else                      error(ev)
    xhr.send()

  unzip = (blob, next)->
    unless blob then return setTimeout -> next(false)
    zip.workerScriptsPath = "lib/"
    zip.useWebWorkers = true
    zip.createReader (new zip.BlobReader blob), ((reader)->
      reader.getEntries (entries)->
        hash = {}
        for entry in entries
          hash[entry.filename] = do ->
            _entry = entry
            mimetype = zip.getMimeType(_entry.filename)
            fileCache = null
            (cb)->
              if fileCache isnt null
                return cb(fileCache)
              _entry.getData (new zip.BlobWriter mimetype), (blob)->
                if /^text/.test mimetype
                  blobToBuffer blob, (buffer)->
                    bufferToText buffer, (text)->
                      fileCache = text
                      cb(text)
                else if /^image/.test mimetype
                  url = URL.createObjectURL(blob)
                  urlToImage url, (img)->
                    URL.revokeObjectURL(url)
                    fileCache = img
                    cb(img)
                else setTimeout -> cb(false)
        reader.close()
        next(hash)
    ), (er)-> next(false)

  blobToDataURL = (blob, next)->
    unless blob then return setTimeout -> next(false)
    reader = new FileReader
    reader.onerrer = -> next(false)
    reader.onload  = -> next(reader.result)
    reader.readAsDataURL(blob)

  blobToBuffer = (blob, next)->
    unless blob then return setTimeout -> next(false)
    reader = new FileReader
    reader.onerrer = -> next(false)
    reader.onload  = -> next(reader.result)
    reader.readAsArrayBuffer(blob)

  bufferToText = (buffer, next)->
    unless buffer then return setTimeout -> next(false)
    uint8Ary = new Uint8Array(buffer)
    unicode  = Encoding.convert(uint8Ary, "UNICODE", "AUTO")
    text     = Encoding.codeToString(unicode)
    setTimeout -> next(text)

  urlToImage = (src, next)->
    unless src then return setTimeout -> next(false)
    img = new Image
    img.onerror = -> next(false)
    img.onload  = -> next(img)
    img.src = src

  filetree = (hash, next)->
    unless hash then return setTimeout -> next(false)
    parent = root = {}
    for path, val of hash
      ary = path.split("/")
      for dir, i in ary
        obj = if i is ary.length - 1 then val else {}
        parent = parent[dir] = parent[dir] or obj
      parent = root
    setTimeout -> next(root)