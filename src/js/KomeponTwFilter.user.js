// ==UserScript==
// @name            KomeponTwFilter
// @namespace       http://furyu.hatenablog.com/
// @author          furyu
// @version         0.1.0.1
// @include         http://komepon.net/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @description     Komepon! の Twitter(Search) タブで、RT 等の、ツイート内容が全て灰色になっているものを除く
// ==/UserScript==

/*
■ 外部ライブラリ
- [jQuery](https://jquery.com/)
    The MIT License
    [License | jQuery Foundation](https://jquery.org/license/)

■ 関連記事など
- [Komepon! - はてブやTwitterのコメントをワンクリックでチェック！](http://komepon.net/)
*/

/*
The MIT License (MIT)

Copyright (c) 2018 furyu <furyutei@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


( function () {

'use strict';

// ■ パラメータ {
var OPTIONS = {
};

// }


// ■ 共通変数 {
var SCRIPT_NAME = 'KomeponTwFilter',
    DEBUG = false;

if ( window[ SCRIPT_NAME + '_touched' ] ) {
    return;
}
window[ SCRIPT_NAME + '_touched' ] = true;


if ( typeof jQuery != 'function' ) {
    console.error( SCRIPT_NAME + ':', 'Library not found - ', 'jQuery:', typeof jQuery );
    return;
}

var $ = jQuery;

// }


// ■ 関数 {
function to_array( array_like_object ) {
    return Array.prototype.slice.call( array_like_object );
} // end of to_array()


function filter_indivisual_user_comment( jq_user_comment ) {
    var jq_filter_result = jq_user_comment.children( 'span[style="color:#bbb;"]' ).filter( function () {
            var span = this,
                prev_text = ( span.previousSibling.nodeType == 3 ) ? span.previousSibling.textContent : '',
                next_text = ( span.nextSibling.nodeType == 3 ) ? span.nextSibling.textContent : '';
            
            return ( /^[\s'"“”‘’`´]*$/.test( prev_text + next_text ) );
        } );
    
    if ( 0 < jq_filter_result.length ) {
        //jq_user_comment.hide();
        jq_user_comment.remove();
    }

} // end of filter_indivisual_user_comment()


function filter_user_comments( jq_target ) {
    if ( ! jq_target ) {
        jq_target = $( '#tw-comments' );
    }
    
    jq_target
        .filter( function () {
            return $( this ).hasClass( 'user-comment' );
        } )
        .add( jq_target.find( '.user-comment' ) )
        .each( function () {
            filter_indivisual_user_comment( $( this ) );
        } );
    
} // end of filter_user_comments()


function start_mutation_observer() {
    new MutationObserver( function ( records ) {
        records.forEach( function ( record ) {
            to_array( record.addedNodes ).forEach( function ( addedNode ) {
                if ( addedNode.nodeType != 1 ) {
                    return;
                }
                
                filter_user_comments( $( addedNode ) );
            } );
        } );
    } ).observe( document.body, { childList : true, subtree : true } );
} // end of start_mutation_observer()


function initialize() {
    filter_user_comments();
    
    start_mutation_observer();
    
    //$( '#tabs-top .tab-tw' ).click( function () {
    //    $( window ).scrollTop( $( window ).scrollTop() + 1 );
    //} );
    
    var jq_tw_more = $( '#tw-more' ),
        watcht_timer_id = setInterval( function () {
            if ( $( '#box-tw' ).is( ':hidden' ) ) {
                return;
            }
            
            if ( jq_tw_more.is( ':hidden' ) ) {
                clearTimeout( watcht_timer_id  );
                return;
            }
            
            if ( jq_tw_more.offset().top < ( $( document ).scrollTop() + $( window ).height() * 1.5 ) ) {
                jq_tw_more.click();
            }
        }, 1000 );

} // end of initialize()


// }


// ■ エントリポイント {

initialize();

// }


} )();

// ■ end of file
