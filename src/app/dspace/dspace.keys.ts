import {Injectable} from 'angular2/core';

/**
 * Some constants.
 */
@Injectable()
export class DSpaceKeys {

    // TODO: think of good refactoring

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
        'DSPACE': 'collections'
    };

    /**
     * Constants for communities
     */
    community = {
        'PLURAL': 'communities',
        'PATH': '/Communities',
        'COMPONENT': 'Communities',
        'METHOD': 'Community',
        'DSPACE': 'subcommunities'
    };

}
