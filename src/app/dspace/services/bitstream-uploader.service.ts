
import { DSpaceService } from '../services/dspace.service';
import { NotificationService } from '../../utilities/notification/notification.service';
import { Item } from "../models/item.model";

import { TranslateService } from "ng2-translate/ng2-translate";
import { FileUploader } from 'ng2-file-upload';

/**
 * A basic bitstream uploader service which extends the default
 * FileUploader provided by https://github.com/valor-software/ng2-file-upload/
 * <p>
 * This service overrides a few key methods to handle uploading of DSpace
 * bitstreams. See below for more info
 */
export class BitstreamUploader extends FileUploader {

    /**
     * Reference to DSpace Item this bitstream will be uploaded to
     * This will be set *after* the Item is created, which is why it need to be public
     */
    public item: Item;

    /**
     * Reference to DSpace REST API authentication token.
     * Required to be set for upload to be authenticated.
     */
    public authToken: string;

    /**
     * Override default constructor to also include key DSpace services
     * @param translate
     *      TranslateService
     * @param dspaceService
     *      DSpaceService is a singleton service to interact with the dspace service.
     * @param notificationService
     *      NotificationService is a singleton service to notify user of alerts.
     * @param options
     *      FileUploader options to pass to default FileUploader
     */
    constructor(private translate: TranslateService,
                private dspaceService: DSpaceService,
                private notificationService: NotificationService,
                options: any) {
        super(options);
    }

   /**
    * Override onAfterAddingFile callback method. This method is called anytime
    * a new file is added to the upload queue.
    */
    public onAfterAddingFile(fileItem: any) {
       // By default, each fileItem has an alias set to 'file'.
       // Clear that value, as we'll use the 'alias' to store our Bitstream file description
       fileItem.alias = '';

       // Set withCredentials to false (which is default value for XHR)
       // DSpace REST API currently doesn't support CORS requests with credentials
       // See also https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Requests_with_credentials
       fileItem.withCredentials = false;
    }


    /**
     * Override onBeforeUploadItem callback method. This method is called before
     * a specific file is uploaded to the server.
     *
     * WARNING: We MUST know the Item we are uploading to!!
     */
    public onBeforeUploadItem(fileItem: any) {
        // We cannot proceed if we don't know the Item or have an authentication token.
        if(this.item === undefined || this.authToken === undefined) {
            // cancel upload
            fileItem.cancel();
        }
        else {
            // Add upload headers to form uploader
            this.options.headers = this.dspaceService.getFileUploadHeaders(fileItem.file.type, this.authToken);

            // Set the file upload URL based on the fileItem's name and alias (i.e. description)
            fileItem.url = this.dspaceService.getFileUploadURL(this.item, fileItem.file.name, fileItem.alias);
        }
     }

    /**
     * Override callback method. This method is called if a file cannot be added to the queue
     * @TODO: use i18n
     */
    public onWhenAddingFileFailed(fileItem:any, filter:any, options:any):any {
        this.notificationService.notify('app', 'DANGER', "File " + fileItem.file.name + " could not be added to queue!");
    }

    /**
     * Override callback method. This method is called if a file cannot be uploaded
     * @TODO: use i18n
     */
    public onErrorItem(fileItem:any, response:any, status:any, headers:any):any {
        this.notificationService.notify('app', 'DANGER', "File " + fileItem.file.name + " could not be uploaded!");
    }

}
