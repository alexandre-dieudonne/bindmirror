export const APP_CONSTANTS = {
    layouts: 'layouts',
    keymaps: 'keymaps',
} as const;

export const APP_MESSAGES = {
    saveSuccess: 'Saved successfully',
    fileImportSuccess: 'File Imported successfully',
    fileExportSuccess: 'File Exported successfully',
    invalidFileKind: 'Invalid file kind',
    invalidFileFormat: 'This file is not a valid export and could not be imported',
    nameAlreadyUsed: 'This name is already in use',
    titleNotSpecified: 'You must specify a title',
} as const;

export const APP_URLS = {
    myLayouts: 'my-layouts',
    myKeymaps: 'my-keymaps',
} as const;
