import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

//TODO it'd be great if we could get these values from bootstrap's variables somehow
const SCREEN_XS_MAX = '767px';
const SCREEN_SM_MIN = '768px';
const SCREEN_SM_MAX = '991px';
const SCREEN_MD_MIN = '992px';
const SCREEN_MD_MAX = '1199px';
const SCREEN_LG_MIN = '1200px';


/**
 *
 */
@Injectable()
export class ViewportService {

    /**
     * Whether or not viewport detection is supported on the platform
     * This will be false on the server, or on old browsers.
     */
    isSupported: boolean;

    //TODO the public versions of these observables should probably be
    //read only, meaning: not BehaviorSubjects

    /**
     * Observe whether the viewport classifies as extra small
     */
    isXs: BehaviorSubject<boolean>;

    /**
     * Observe whether the viewport classifies as small
     */
    isSm: BehaviorSubject<boolean>;

    /**
     * Observe whether the viewport classifies as medium
     */
    isMd: BehaviorSubject<boolean>;

    /**
     * Observe whether the viewport classifies as large
     */
    isLg: BehaviorSubject<boolean>;

    constructor() {
        this.isXs = new BehaviorSubject<boolean>(undefined);
        this.isSm = new BehaviorSubject<boolean>(undefined);
        this.isMd = new BehaviorSubject<boolean>(undefined);
        this.isLg = new BehaviorSubject<boolean>(undefined);

        if (typeof matchMedia === "function") {
            this.isSupported = true;
            
            const xsMQL:MediaQueryList = matchMedia(`(max-width: ${SCREEN_XS_MAX})`);
            const smMQL:MediaQueryList = matchMedia(`(min-width: ${SCREEN_SM_MIN}) and (max-width: ${SCREEN_SM_MAX})`);
            const mdMQL:MediaQueryList = matchMedia(`(min-width: ${SCREEN_MD_MIN}) and (max-width: ${SCREEN_MD_MAX})`);
            const lgMQL:MediaQueryList = matchMedia(`(min-width: ${SCREEN_LG_MIN})`);

            //initialize the values
            this.isXs.next(xsMQL.matches);
            this.isSm.next(smMQL.matches);
            this.isMd.next(mdMQL.matches);
            this.isLg.next(lgMQL.matches);
            
            //listen for changes
            xsMQL.addListener((mql:MediaQueryList) => {
                this.isXs.next(mql.matches);
            });
            //listen for changes
            smMQL.addListener((mql:MediaQueryList) => {
                this.isSm.next(mql.matches);
            });
            //listen for changes
            mdMQL.addListener((mql:MediaQueryList) => {
                this.isMd.next(mql.matches);
            });
            //listen for changes
            lgMQL.addListener((mql:MediaQueryList) => {
                this.isLg.next(mql.matches);
            });
        }
        else {
            this.isSupported = false;
        }
    }
}