import {Component, Input} from 'angular2/core';
import {IContainerHomepage} from "../models/container-homepage.interface";
import {ContainerLogoComponent} from "./container-logo.component";

@Component({
    selector: 'container-home',
    directives: [ContainerLogoComponent],
    template: `
        <h1 class="page-header">{{ container.name }}</h1>
        <container-logo *ngIf="container.logo" [logo]="container.logo"></container-logo> 
        <div *ngIf="container.introductoryText" class="container-home-intro-text" [innerHTML]="container.introductoryText"></div>
        <div *ngIf="container.news" class="container-home-news">
            <h2>News</h2> <!--TODO i18n-->
            <div [innerHTML]="container.news"></div>
        </div>
        <div *ngIf="container.copyrightText" class="container-home-copyright" [innerHTML]="container.copyrightText"></div>
    `
})

export class ContainerHomeComponent {
    @Input() container: IContainerHomepage;

}