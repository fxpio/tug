@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\create-api-key" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\create-api-key" %*
)
