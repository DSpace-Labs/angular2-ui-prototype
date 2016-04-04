import {Injectable} from 'angular2/core';

/**
 * 
 */
@Injectable()
export class DSpaceKeys {

    // TODO: think of good refactoring

    /**
     * 
     */
    item = {
        'PLURAL': 'items',
        'PATH': '/Items',
        'COMPONENT': 'Items',
        'METHOD': 'Item',
        'DSPACE': 'items'
    };

    /**
     * 
     */
    collection = {
        'PLURAL': 'collections',
        'PATH': '/Collection',
        'COMPONENT': 'Collections',
        'METHOD': 'Collection',
        'DSPACE': 'collections'
    };

    /**
     * 
     */
    community = {
        'PLURAL': 'communities',
        'PATH': '/Communities',
        'COMPONENT': 'Communities',
        'METHOD': 'Community',
        'DSPACE': 'subcommunities'
    };

}
