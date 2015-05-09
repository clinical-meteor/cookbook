## fonts-barcode

Admit it, we all love fonts. And how cool is it that barcodes are just fonts? Useful for any apps requiring inventory tracking or printing of labels.

------------------------
### Installation

First, install the fonts-barcode package from the command line, like so:

````
meteor add clinical:barcodes
````

------------------------
### Data/Document Model

Then, simply add the 'barcode' class to the appropriate HTML tags.

````html
<div>This is a barcode: <span class="barcode">*123-45-6789*</span></div>
````


------------------------
### Reminder

You MUST enclose your barcode with asterixes!!!

````
*123456789*
````

------------------------
### Copyright / Licensing

Code 3 of 9 seems to be in the public domain.  
