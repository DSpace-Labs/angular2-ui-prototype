import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { Collection } from '../dspace/models/collection.model';
import { SidebarService } from './services/sidebar.service';

import { AuthorizationService } from '../dspace/authorization/services/authorization.service';



/**
 * Class to populate the sidebar on collection pages.
 */
export class CollectionSidebarHelper
{

    /**
     *  The sections added by the Collection component.
     */
    sections : Array<SidebarSection>;

    /**
     *
     * @type {boolean}
     */
    isAuthenticated : boolean = false;

    /**
     *
     * @param sidebarService
     *    SidebarService is a singleton service to interact with our sidebar
     * @param collection
     *      Collection is the current collection we are visiting.
     *      We want this to populate the RouteParams with the ID of the current collection
     * @param authorization (optional)
     *      AuthorizationService is a singleton service to interact with the authorization service.
     */
    constructor(private sidebarService : SidebarService, private collection : Collection, private authorization? : AuthorizationService)
    {
        this.sidebarService = sidebarService;
        this.sections = [];
    }

    /**
     * The collection sidebar requires a collection object
     * Because we need some data from the collection to populate the links
     */
    populateSidebar()
    {

        if(this.authorization != null)
        {
            this.isAuthenticated = this.authorization.isAuthenticated();
        }


        let browseChildSection = SidebarSection.getBuilder()
            .name("sidebar.context-collection.edit")
            .route("E404")
            .visible(this.isAuthenticated)
            .visibilityObservable(this.authorization.userObservable)
            .build()

        let addItemSection = SidebarSection.getBuilder()
            .name("sidebar.context-collection.create-item")
            .route("ItemCreate")
            .visible(this.isAuthenticated)
            .visibilityObservable(this.authorization.userObservable)
            .build();

        let collectionSection = SidebarSection.getBuilder()
            .name("sidebar.context-collection.header")
            .id("context-collection")
            .visible(this.isAuthenticated)
            .visibilityObservable(this.authorization.userObservable)
            .addChildren([browseChildSection,addItemSection])
            .build();
        this.sidebarService.addSection(collectionSection);
        this.sections.push(collectionSection);
    }


    /**
     *
     */
    removeSections()
    {
        this.sections.forEach(section => this.sidebarService.removeSection(section));
    }
}