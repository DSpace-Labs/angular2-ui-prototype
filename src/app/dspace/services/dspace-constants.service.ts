import { Injectable } from '@angular/core';

/**
 * Service which provides some constants for interaction with the DSpace REST API
 */
@Injectable()
export class DSpaceConstantsService {

    /**
     * Constants for items
     */
    item = {
        'PLURAL': 'items',
        'PATH': '/Items',
        'COMPONENT': 'Items',
        'METHOD': 'Item',
        'DSPACE': 'items'
    };

    /**
     * Constants for collections
     */
    collection = {
        'PLURAL': 'collections',
        'PATH': '/Collection',
        'COMPONENT': 'Collections',
        'METHOD': 'Collection',
        'DSPACE': 'collections',
        'SUBTYPES': 'items'
    };

    /**
     * Constants for communities
     */
    community = {
        'PLURAL': 'communities',
        'PATH': '/Communities',
        'COMPONENT': 'Communities',
        'METHOD': 'Community',
        'DSPACE': 'subcommunities',
        'SUBTYPES': 'comcols'
    };

}
