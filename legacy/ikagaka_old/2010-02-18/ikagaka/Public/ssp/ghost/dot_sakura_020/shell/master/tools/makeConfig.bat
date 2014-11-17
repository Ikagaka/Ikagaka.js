@echo off
set PHP_COMMAND=makeConfig.phu
set PHP_CONFIG=-d mbstring.language=Japanese
set PHP_CONFIG=%PHP_CONFIG% -d mbstring.internal_encoding=UTF-8


php %PHP_CONFIG% %PHP_COMMAND%
set PHP_COMMAND=
set PHP_CONFIG=
