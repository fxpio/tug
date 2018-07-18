@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\deconfig" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\deconfig" %*
)
