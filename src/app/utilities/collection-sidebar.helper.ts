import { Inject } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar-section.model';
import { Collection } from '../dspace/models/collection.model';
import { SidebarService } from './services/sidebar.service';


/**
 * Class to populate the sidebar on collection pages.
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
    constructor(private sidebarService : SidebarService, private collection : Collection)
    {
        this.sidebarService = sidebarService;
        this.sections = [];
    }

    /**
     * The collection sidebar requires a collection object
     * Because we need some data from the collection to populate the links
     * @param collection
     */
    populateSidebar()
    {
        let homeChildSection =  SidebarSection.getBuilder()
            .name("sidebar.context-collection.view")
            .route("Collections",{id : this.collection.id})
            .build();

        let browseChildSection = SidebarSection.getBuilder()
            .name("sidebar.context-collection.edit")
            .route("CollectionEdit",{id: this.collection.id})
            .build();

        let addItemSection = SidebarSection.getBuilder()
            .name("sidebar.context-collection.create-item")
            .route("Home")
            .build();

        let collectionSection = SidebarSection.getBuilder()
            .name("sidebar.context-collection.header")
            .id("context-collection")
            .addChildren([homeChildSection,browseChildSection,addItemSection])
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