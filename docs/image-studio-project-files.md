# Image Studio Pro project files

Image Studio Pro saves editable drawings as JSON with the `.wtoolsimage`
extension. The project contains the base canvas image, vector shapes, canvas
settings, and format metadata.

## Compatibility

- New projects are saved as `.wtoolsimage`.
- Existing `.wtools-image` projects remain supported through the standard file
  input used as a fallback.
- Plain `.json` project files can also be opened.

The hyphenated extension must not be placed in `showSaveFilePicker()` or
`showOpenFilePicker()` accept options. Chromium rejects the `-` character in a
File System Access API extension before displaying the native dialog.

## Manual verification

1. Open Image Studio Pro and make a visible change.
2. Choose **Save project as**.
3. Confirm the native dialog suggests `worldtools-image.wtoolsimage`.
4. Save, make another change, then choose **Save** and verify the same file is
   updated without an error toast.
5. Open a legacy `.wtools-image` file and verify that the drawing is restored.
