; Change default install directory on Windows
; https://www.electron.build/configuration/nsis#how-do-change-the-default-installation-directory-to-custom
!macro preInit
    SetRegView 64
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\Parity Technologies\Parity UI"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\Parity Technologies\Parity UI"
    SetRegView 32
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\Parity Technologies\Parity UI"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "C:\Program Files\Parity Technologies\Parity UI"
!macroend
