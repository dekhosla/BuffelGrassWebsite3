function createFolder() {
    return gapi.client.drive.files.insert(
        {
            'resource': {
                "title": 'Drive API From JS Sample',
                "mimeType": "application/vnd.google-apps.folder"
            }
        }
    )
}