---
title: "Power Apps Barcode Scanner Control Is Retired: Use the Barcode Reader Control Instead"
summary: "The legacy Power Apps barcode scanner control is retired and replaced by the barcode reader control. This guide covers both from Microsoft Learn: how to enable the old one, key properties, supported barcode types, a first scanning app and known limits."
status: review
publish: false
author: mirko-p
date: 2026-12-28
topics: [power-apps-barcode-scanner, power-apps]
keypoints:
  - "Learn calls the barcode scanner control retired and says the barcode reader control replaces it with the latest improvements. Use the reader for new apps."
  - "The legacy control is hidden by default. Turn on Legacy barcode scanner under Settings, Upcoming features, Retired in Power Apps Studio."
  - "Both controls open a native scanner on Android, iOS and Windows. Neither supports scanning in a web browser."
  - "The reader returns a Barcodes table with Value and Type. Use First(BarcodeReader.Barcodes).Value to show a result."
  - "The reader does not support Select(). Learn gives a workaround with a transparent fill placed in front of the other control."
faq:
  - q: "Is the barcode scanner control still available?"
    a: "According to Microsoft Learn it is a retired legacy control, hidden from the Insert pane by default. Existing functionality continues to be supported, but the barcode reader control should be used where possible."
  - q: "Which platforms are supported?"
    a: "Android, iOS and Windows. On other platforms the app shows a warning that some features will not work. Scanning in a web browser is not supported."
  - q: "How do I restrict scanning to certain barcode types?"
    a: "Learn says BarcodeType can combine types by concatenation. For the reader the example is the Code128 and Code39 values joined with the ampersand operator. The default is Auto."
  - q: "Why is PDF_417 or AZTEC not scanned in Auto mode?"
    a: "Learn states that for the legacy scanner PDF_417 and AZTEC are not supported in Auto mode, so BarcodeType must be set explicitly. Check the reader page for the types it supports per device."
  - q: "How do I show the scanned value?"
    a: "The control does not display the result. Learn suggests a Label whose Text is First(BarcodeReader.Barcodes).Value, with its Live property set to Polite for screen reader users."
---

Canvas apps have two barcode controls in Microsoft Learn: a legacy barcode scanner and the barcode reader. Learn describes the scanner as retired and the reader as its replacement. This guide covers how to build a scanning app with the reader and what changes if you have to maintain an older app.

## The legacy barcode scanner

- It opens a native scanner on Android, iOS or Windows and detects a barcode, QR code or data-matrix code in view.
- It is hidden from the Insert pane. In Power Apps Studio open Settings, select Upcoming features, then the Retired tab, and turn on Legacy barcode scanner.
- Key properties: Value (text of the last scan), Type, OnScan, OnCancel, BarcodeType (default Auto), PreferFrontCamera and FlashlightEnabled.
- It does not display the scan result itself, because the control is a button.

## The barcode reader control

On iOS and Android the reader offers three modes: Automatically scan, Select to scan and Scan multiple. On Windows it always scans automatically. It supports zoom levels and turning the flashlight on or off in the scanner.

| Property | What it does |
| --- | --- |
| Barcodes | Output table with Value and Type columns |
| OnScan | Actions after a successful scan |
| OnCancel | Actions when the user cancels |
| OnChange | Actions when a property changes |
| BarcodeType | Types to scan, combined by concatenation. Default Auto |
| Scanning mode | Automatically scan, Select to scan or Scan multiple |
| Scanning quality | Image quality. Default Automatic. On Windows it uses the camera quality |
| PreferFrontCamera, BeepOnScan, VibrateOnScan | Camera choice and feedback |

## Build a first scanning app

This follows the Learn how-to for a canvas app with the barcode reader.

1. Create a blank canvas app.
2. Select Screen1, then Insert, expand Media and select Barcode reader.
3. Open the Advanced tab and set OnScan to a formula that collects the first scanned value and the time. The page uses Collect with a collection named colScannedItems, with fields ScannedItem and ScannedTime set to First(BarcodeScanner1.Barcodes).Value and Now().
4. Insert a Vertical gallery, choose the Title and subtitle layout and set Items to colScannedItems.
5. Set the title text to ThisItem.ScannedItem and the subtitle text to ThisItem.ScannedTime.
6. Press F5 to test in Studio, then save and publish.
7. Install Power Apps Mobile, open the app, select Scan and scan a label.

The page names the control BarcodeScanner1 in formulas although the menu entry is Barcode reader, so use the name shown in the tree view. The page does not describe saving scans to a data source.

## Supported barcode types

For the reader on iOS and Android, Learn lists QR_CODE, DATA_MATRIX, AZTEC, CODABAR, CODE_128, CODE_39, CODE_93, EAN, ITF, PDF_417, RSS14, RSS_EXPANDED, UPC and Micro QR Code. On Windows it lists QR_CODE, CODABAR, CODE_128, CODE_39, EAN and UPC. GS1-DWCode and MSI are not supported on either.

## Legacy scanner barcode types

For the legacy scanner, Learn gives a per-device table. QR_CODE, UPC_A, UPC_E, EAN_8, EAN_13, CODE_39 and CODE_128 are listed for Android, iOS and Windows. DATA_MATRIX, CODE_93, ITF, PDF_417 and AZTEC are listed for Android and iOS only. CODABAR is listed for Android and Windows, and RSS14 and RSS_EXPANDED for Android only. MSI is not supported anywhere. Databar Omnidirectional, Databar Stacked, GS1-DWCode and Interleaved 2 of 5 are listed for Windows only. PDF_417 and AZTEC need BarcodeType set explicitly.

## Other properties

Both controls have the usual button properties: Text for the button label, BorderColor, BorderStyle, BorderThickness, DisplayMode (Edit, View or Disabled), Height, Width, Tooltip, Visible, X and Y.

## Limitations

- The reader does not support Select(). The workaround on the page is to set its fill color to transparent and place it in front of the control you want to trigger it.
- The reader page says the control does not support scanning in a web browser. The sentence appears under the Select to scan mode, so check your own case.
- Only Android, iOS and Windows are supported.

## Accessibility

Because the control is a button, the Button guidelines apply. Show the result in a Label with Text set to First(BarcodeReader.Barcodes).Value and Live set to Polite. Offer a Text input as a manual alternative for users who cannot point a camera.

## Not covered

The how-to lists a Power Apps license and the Environment Maker security role as prerequisites but gives no licensing details. The pages do not describe saving scans to Dataverse or SharePoint, because the how-to keeps scans in a collection inside the app.

## Related

- [Power Apps barcode scanner](https://www.m365.fm/entity/power-apps-barcode-scanner/)
- [Power Apps](https://www.m365.fm/entity/power-apps/)

## Sources

- [Barcode scanner control (retired) in Power Apps (Microsoft Learn)](https://learn.microsoft.com/power-apps/maker/canvas-apps/controls/control-new-barcode-scanner)
- [Barcode reader control in Power Apps (Microsoft Learn)](https://learn.microsoft.com/power-apps/maker/canvas-apps/controls/control-barcodereader)
- [Create a canvas app with the barcode reader control (Microsoft Learn)](https://learn.microsoft.com/power-apps/maker/canvas-apps/how-to/create-app-barcode-scanner)
