import { Inject } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar-section.model';
import { Collection } from '../dspace/models/collection.model';
import { SidebarService } from './services/sidebar.service';


/**
 * Class to populate the sidebar on item-view pages.
 */
export class CollectionSidebarHelper
{

    /**
     *
     */
    sections : Array<SidebarSection>;

    /**
     *
     * @param sidebarService
     */
    constructor(private sidebarService : SidebarService)
    {
        this.sidebarService = sidebarService;
        this.sections = [];
    }

    /**
     * The collection sidebar requires a collection object
     * Because we need some data from the collection to populate the links
     * @param collection
     */
    populateSidebar(collection : Collection)
    {
        let collectionhome =  SidebarSection.getBuilder()
            .name("sidebar.context-collection.home")
            .routeid(collection.id)
            .route("Collections")
            .build();

        let browseComponent = SidebarSection.getBuilder()
            .name("sidebar.context-collection.browse")
            .route("Home")
            .build();

        let collectionSection = SidebarSection.getBuilder()
            .name("sidebar.context-collection.header")
            .id("context-collection")
            .addChild(collectionhome)
            .addChild(browseComponent)
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