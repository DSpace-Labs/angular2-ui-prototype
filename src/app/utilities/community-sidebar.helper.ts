import { Inject, Injectable } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { Community } from '../dspace/models/community.model';
import { SidebarService } from './services/sidebar.service';

import { AuthorizationService } from '../dspace/authorization/services/authorization.service';
import { SidebarHelper  } from './sidebar.helper';


/**
 * Class to populate the sidebar on community pages.
 */
@Injectable()
export class CommunitySidebarHelper extends SidebarHelper
{


    /**
     *
     * @param sidebarService
     *       SidebarService is a singleton service to interact with our sidebar
     * @param community
     *       Community is the current community that has added this sidebar
     *       We want this community to provide the ID to the RouteParams.
     * @param authorization
     *       AuthorizationService is a singleton service to interact with the authorization service.
     */
    constructor(@Inject(SidebarService) sidebarService : SidebarService, @Inject(AuthorizationService) private authorization : AuthorizationService) // can not put collection in here anymore because we will let DI take care of this.
    {
        super(sidebarService);
    }


    /**
     * The community sidebar
     *
     */
    populateSidebar(community) // pass community for the id of the community.
    {

        this.isAuthenticated = this.authorization.isAuthenticated();

        let browseChildSection = SidebarSection.getBuilder()
            .name("sidebar.context-collection.edit")
            .route("E404")
            .testFunction( () => {
                return this.authorization.isAuthenticated();
            })
            .dirtyObservable(this.authorization.userObservable)
            .build();

        let createCommunity = SidebarSection.getBuilder()
            .name("sidebar.context-community.create-community")
            .route("CommunityCreate")
            .testFunction( () => {
                return this.authorization.isAuthenticated();
            })
            .dirtyObservable(this.authorization.userObservable)
            .build();

        let createCollection = SidebarSection.getBuilder()
            .name("sidebar.context-community.create-collection")
            .route("CollectionCreate")
            .testFunction( () => {
                return this.authorization.isAuthenticated();
            })
            .dirtyObservable(this.authorization.userObservable)
            .build();

        let communitySection = SidebarSection.getBuilder()
            .name("sidebar.context-community.header")
            .id("context-collection")
            .testFunction( () => {
                return this.authorization.isAuthenticated();
            })
            .dirtyObservable(this.authorization.userObservable)
            .addChildren([browseChildSection,createCollection,createCommunity])
            .build();
        this.sidebarService.addSection(communitySection);
        this.sections.push(communitySection);
    }


    /**
     *
     */
    removeSections()
    {
        this.sections.forEach(section => this.sidebarService.removeSection(section));
    }
}