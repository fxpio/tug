@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\encode-queue-event" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  "%~dp0\encode-queue-event" %*
)
