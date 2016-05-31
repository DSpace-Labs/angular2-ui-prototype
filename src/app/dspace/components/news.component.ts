import { Component } from '@angular/core';


/**
 * Just a page which will show some static 'news' content.
 */
@Component({
    selector : "news",
    template:   ` 
                    <h1> news page </h1>
                    <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas porta pretium massa. Pellentesque vitae sem elit. Nam commodo ipsum lorem, varius consectetur nisl consectetur eget. Cras et convallis purus. Phasellus cursus nisi eget tortor ultricies, non interdum ipsum sagittis. Pellentesque tincidunt faucibus metus quis finibus. Integer elementum risus vel dolor rhoncus, in ullamcorper dolor congue. Vestibulum mollis vulputate dapibus. Ut erat ante, ullamcorper vel quam eu, vehicula maximus eros. Sed blandit leo tortor. Etiam vel magna facilisis, accumsan odio at, dapibus metus. Vestibulum sagittis dui quis interdum pellentesque. Donec posuere vehicula diam elementum consequat.
                    <p><p>
Sed mollis tincidunt felis, et rutrum metus faucibus non. Pellentesque tempor velit id augue tempor, sit amet luctus erat porttitor. Integer sodales enim sit amet nisi placerat congue. Pellentesque vel semper massa, sit amet consectetur quam. Cras augue nulla, ultricies in volutpat in, dictum vestibulum leo. Nulla facilisi. Aliquam non tellus orci. Nam tristique pellentesque magna ac efficitur. Mauris ut tortor finibus neque eleifend volutpat. Nullam dictum facilisis urna vitae commodo.
</p><p>
In pharetra tempor laoreet. Maecenas commodo mattis sapien quis scelerisque. Nunc velit sem, finibus posuere neque in, posuere elementum ligula. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam rutrum, urna nec cursus iaculis, urna ipsum feugiat eros, sed porttitor enim sapien in ligula. Praesent fringilla a neque et malesuada. Proin sollicitudin felis eget dolor ullamcorper mollis. In hac habitasse platea dictumst. Duis suscipit ac dolor mollis volutpat. Quisque at tempus nisl, eget ultricies tellus. Praesent ut risus suscipit, consectetur lorem nec, elementum velit. Sed enim ligula, placerat at varius nec, efficitur in ipsum. Praesent leo mi, gravida sed gravida in, volutpat eu diam. Mauris lacinia nisl in quam accumsan elementum. Fusce sapien neque, ultrices et libero et, elementum porttitor felis. Sed sed pretium ligula.
</p>
<p>
Morbi eleifend ornare sapien at pellentesque. Ut consequat rhoncus ipsum, ac ullamcorper nisl. Donec iaculis, erat ac feugiat rutrum, quam felis faucibus quam, ut aliquet mauris sapien id elit. Nunc consequat, arcu id tempus euismod, mi dolor cursus elit, id dignissim urna ex vitae erat. Sed ac magna est. Nullam in erat rutrum, porttitor diam vel, fermentum erat. Sed ultricies massa id justo accumsan, quis aliquet est elementum. Aenean a urna at nisl sollicitudin feugiat. Etiam posuere magna ex, ac rutrum ipsum molestie ac.
                    </p>
                `
})

/**
 *
 */
export class NewsComponent{


    constructor()
    {
        console.log("In the news page");
    }
}
