# **eViewer Split, Undo & Redo Sample**

The eViewer Split, Undo & Redo Sample demonstrates powerful document
manipulation capabilities features such as splitting a document,
undo-redo, directly within the browser.

-   **Split Document**: Split a single document into multiple documents
    for easier handling and organization.

-   **Undo/Redo Actions**: Effortlessly revert or reapply recent
    actions, ensuring a smooth and flexible experience.

This sample runs entirely on the client side, requiring **no
server-side** processing for document.

## **Set up eViewer**

Follow the steps below to run the eViewer Split, Undo & Redo Sample:

-   Clone this repository and host it via an HTTP server.

-   Download the viewer static files from the [eViewer7 npm
    repo](mailto:(https://www.npmjs.com/package/@mstechusa/eviewer7))
    into the **viewer** folder. All viewer files should be placed in the
    root viewer folder.

-   Open the **eViewerPage.html** file in your browser to launch the
    viewer.

## **Using Split, Undo & Redo Functionality**

Once the eViewer is launched, you can use the following steps to try out
the Split, Undo, and Redo features.

### **Split Document**:

-   Open a document in the viewer.

-   Select the page from which you want to split the document.

-   Navigate to the **Split** option in the top toolbar.

-   Once the split is performed, a new document is automatically created
    starting from the selected page to the end of the file. By default,
    this new document is named **Group1**.

![](https://eviewer.net/wp-content/uploads/2025/11/Split-Document.png)

### **Undo Action**:

-   Use the **Undo** button at any time to reverse the most recent
    operation (e.g., rotate, invert, or split).

-   This will revert the last performed action and restore the previous
    document state.

### **Redo Action**:

-   To reapply an action that was undone, click the **Redo** icon next
    to the undo button.

-   This applies the most recent undone operation, allowing you to
    quickly move between document states.

![](https://eviewer.net/wp-content/uploads/2025/11/Undo-Redo.png)

## **Split, Undo & Redo via APIs**

In addition to using the toolbar buttons, users can also perform Split,
Undo, and Redo operations through the APIs section available at the top
of the application interface (as shown in the image below).

![](https://eviewer.net/wp-content/uploads/2025/11/API-Panel.png)

This allows you to interact with the eViewer functionalities
programmatically:

-   **Split Document** -- Invokes the [**Split Document
    API**](https://eviewer.net/developer-guide/#Split_Document) to
    divide the document starting from the specified page.

-   **Undo** -- Calls the [**Undo
    API**](https://eviewer.net/developer-guide/#Undo) to revert the most
    recent operation.

-   **Redo** -- Calls the [**Redo
    API**](https://eviewer.net/developer-guide/#Redo) to reapply an
    operation that was previously undone.

This API-based panel helps developers access the functionality without
navigating through the viewer's toolbar.

For more detailed API specifications and integration references, please
refer to the official API documentation:
<https://eviewer.net/developer-guide/>

## **API Implementation Code**

This section contains the JavaScript functions used to perform
**Split**, **Undo**, and **Redo** operations programmatically in the
eViewer application.

```javascript
function callSplitDocApi() {
  let userName = "";
  eViewerObj = new eViewerApp(userName);

  let splitForm = document.getElementById("splitForm");
  let splitFromPageNo = splitForm.elements["pageNumber"].value;
  eViewerObj.splitDocument(splitFromPageNo).then((response) => {
    console.log("splitDocument: " + response);
    splitForm.reset();
  });
}

function callUndoApi() {
  let documentID = "";
  this.eViewerObj.documentService.getActiveDocument().then((response) => {
    documentID = response.viewerDocID;
  });
  eViewerObj.documentService.undo(documentID).then((response) => {
    console.log("DocumentId " + response);
  });
}

function callRedoApi() {
  let documentID = "";
  this.eViewerObj.documentService.getActiveDocument().then((response) => {
    documentID = response.viewerDocID;
  });
  eViewerObj.documentService.redo(documentID).then((response) => {
    console.log("DocumentId " + response);
  });
}
```

## **Try the Demo**

Experience the live version of this sample here:

[Live
Demo](https://mst2019b2.eastus.cloudapp.azure.com:8443/eviewer7-document-viewing/#/dashboard/dashboard/38)

## **License**

The license key is provided by **MST**.

For more information or licensing inquiries, please contact us at
<info@ms-technology.com>



