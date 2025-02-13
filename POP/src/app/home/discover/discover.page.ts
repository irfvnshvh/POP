import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Storage } from '@ionic/storage';
import * as $ from 'jquery';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { CommentPage } from '../../modal/comment/comment.page';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
}
)
export class DiscoverPage implements OnInit {

  constructor(
    private router: Router,
    private dataService: DataService,
    public toastCtrl: ToastController ,
    private modalController: ModalController,
    private menu: MenuController
  ) { }

  // public likeShow = false;
  // public unlikeShow = false;
  enterid: string;
  userposts: any = [];
  discoverposts: any = [];
  socialposts: any = [];

  currentsid: any;

  likesdata: any = [];
  commentdatas: any = [];

  isLiking:number=-1;

  dataReturned: any = [];

  ddata: number;
  rdata: number;

  ngOnInit() {
    // var slides = document.querySelector('ion-slides');

    // Optional parameters to pass to the swiper instance.
    // See http://idangero.us/swiper/api/ for valid options.
    // slides.options = {
    //   initialSlide: 0,
    //   speed: 400
    // }

    this.myData();
  }

  ionViewWillEnter(){
    // $("#discover-gallery").html("");
    $("#discover-gallery").html("");
    $("#social-gallery").html("");   
  
    this.retrieveDiscover();
    this.retrieveSocial();
    this.retrieveUser();
  }

  async myData(){
    const storage = new Storage();
    await storage.create();
    this.currentsid = await storage.get('usersid');
    console.log("logged: " + this.currentsid);

    this.retrieveDiscover();
    this.retrieveSocial();
    // this.retrieveLikes();
  }

  async showToast(data: any) {
    const toast = await this.toastCtrl.create({
      message: data,
      duration: 2000,
      position: 'top',
      color: 'success'
    });
    toast.present();
  }

  async showErrorToast(data: any) {
    const toast = await this.toastCtrl.create({
      message: data,
      duration: 2000,
      position: 'top',
      color: 'danger'
    });
    toast.present();
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  async presentModal(postid, comments, likes, discoverpost) {
    const modal = await this.modalController.create({
      component: CommentPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'postid': postid,
        'currentsid': this.currentsid,
        'comments': comments,
        'likes': likes
      },
      presentingElement: await this.modalController.getTop() // Get the top-most ion-modal
    });

    // const { data } = await modal.onWillDismiss();
    // console.log(data);
    modal.onDidDismiss()
      .then((data) => {
        // const rdata = data['data'];
        this.ddata = data['data'];
        this.rdata = JSON.parse(data['role']);

        if (this.rdata === JSON.parse(discoverpost.likes) + 1){
          discoverpost.likes = this.rdata;  
          discoverpost.likedusersid = this.currentsid;
          console.log("liiked:" + discoverpost.likedusersid == this.currentsid);
        }else if (this.rdata === JSON.parse(discoverpost.likes) - 1){
          discoverpost.likedusersid = "";
          console.log("unliked:" + discoverpost.likedusersid !== this.currentsid);
        }
        discoverpost.comments = this.ddata;
        // console.log(data['role']);
    });
    // modal.onDidDismiss().then((dataReturned) => {
    //   if (dataReturned !== null) {
    //     this.dataReturned = dataReturned.data;
    //     //alert('Modal Sent Data :'+ dataReturned);

    //     console.log(JSON.stringify(this.dataReturned));
    //   }
    // });

    return await modal.present();
  }

  doRefresh(event) {
    console.log('Begin async operation');
    $("#discover-gallery").html("");
    $("#social-gallery").html("");   
    this.retrieveDiscover();
    this.retrieveSocial();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

//   retrieveDiscover(){
//     console.log("retrieve Discover");

// var obj, dbParam, xmlhttp, myObj, x, txt = "";

// obj = { "limit":100};
// dbParam = JSON.stringify(obj);
// xmlhttp = new XMLHttpRequest();

// xmlhttp.onreadystatechange = function() {
//   if (this.readyState == 4 && this.status == 200) {
//     myObj = JSON.parse(this.responseText);
//     for (x in myObj) {
//       var postsData = {
//       date: myObj[x].postdate,
//       usersid: myObj[x].usersid,
//       id: myObj[x].postid,
//       url: myObj[x].posturl,
//       desc: myObj[x].postdesc,
//       }

//        //change to div for ion-card-content for full scale img
//     $("#discover-gallery").prepend(
//       `
//       <ion-item style=" --ion-card-background: #FFFFFF;">
//       <ion-card style="width:100%; height:100vh;">
//       <ion-card-header style="width:100%; height:30px ;margin: 10px 0;">
//       <ion-card-subtitle>
//         <div class="small-user" style="width:100%; float:left;"><a href="/home/profiles/${postsData.usersid}">${postsData.usersid}</a></div>
//       </ion-card-subtitle>
//       </ion-card-header>
//       <ion-card-content id="post_${postsData.id}"style="width:100%; height:100vh;">
      
//         <img src="${postsData.url}" style="width:100%; height:300px ;margin: 30px 0;">

//         <div class="bars" style="margin: 30px 0; width:100%; height: 20vh;">
//         <ion-button class="opened" (click)="open()">Open</ion-button>
//         <ion-button onclick="liked()">Open</ion-button>
//         <div class="left-bar" style="width:75%; float: left"> 
//           <p>${postsData.desc}</p>
//         </div>

//       <div class="right-bar" style="display:flex; flex-direction: column; float:right;">
//         <ion-button icon-only onclick="liked()"><ion-icon name="heart-outline" style="font-size:50px;"></ion-button>
//         <ion-icon name="chatbox-outline" class="comment" style="font-size:50px;"></ion-icon>
//       </div>
//       </div>

//         <p style="float:right; display:block; margin: 30px 0">${postsData.date}</p>
//       </ion-card-content> 
//       </ion-card>
//         </ion-item>
//         `
// );
//     // return;
//   }
//     console.log(myObj);
//   }
// };
// xmlhttp.open("GET", "https://student.amphibistudio.sg/10187403A/POP/db/posts.php?x=" + dbParam, true);
// xmlhttp.send();

// // $('.opened').hide();
//   }

retrieveUser(){
  // console.log("retrieve Discover");

  this.dataService.getProfile().subscribe(response => {
    if(response != null){  
    //this.showToast('Logged in');
      // console.log('link:' + 'https://student.amphibistudio.sg/10187403A/POP/db/posts.php?x=');
      // console.log(response);
      this.userposts = response;
    }else{
      //this.showErrorToast('Wrong userid/ password');
    }
})
}

  retrieveDiscover(){
      // console.log("retrieve Discover");
  
      this.dataService.getPosts(this.currentsid).subscribe(response => {
        if(response != null){  
        //this.showToast('Logged in');
          // console.log('link:' + 'https://student.amphibistudio.sg/10187403A/POP/db/posts.php?x=');
          // console.log(response);
          this.discoverposts = response;
        }else{
          //this.showErrorToast('Wrong userid/ password');
        }
    })
  }

  retrieveSocial(){
    // console.log("retrieve Social");

    this.dataService.getPosts(this.currentsid).subscribe(response => {
      if(response != null){  
      //this.showToast('Logged in');
        // console.log('link:' + 'https://student.amphibistudio.sg/10187403A/POP/db/posts.php?x=');
        // console.log(response);
        this.socialposts = response;
      }else{
        //this.showErrorToast('Wrong userid/ password');
      }
  })
  }

  // retrieveLikes(){
  //   this.dataService.checkLikes(this.currentsid).subscribe(response => {
  //     if(response != null){  
  //     //this.showToast('Logged in');
  //       console.log('link:' + 'https://student.amphibistudio.sg/10187403A/POP/db/liking.php?x=');
  //       console.log("liked: " + JSON.stringify(response));
  //       this.likedposts = response;
  //       // $('.like21').addClass('hide');
  //       // $('.unlike21').removeClass('hide');
  //       // console.log("???");
  //       if(this.likedposts.liked == 1){
  //         console.log('true');
  //         this.isLiked = !this.isLiked;
  //       }
  //     }else{
  //       // this.likeShow = true;
  //       // this.unlikeShow = false;
  //       //this.showErrorToast('Wrong userid/ password');
  //     }
  // })
  // }

  like(postid, currentsid, discoverpost){

      let likePostData = {
        likedid: '',
        likedpostid: postid,
        likedusersid: currentsid,
        liked: '1',
      }

      const data = likePostData;
      console.log('likePostData: ' + JSON.stringify(data));

    //   this.dataService.getCheck(this.userid).subscribe(response => {
    //     if(response != null){  
    this.dataService.likes(data).subscribe(response => {
    if(response != null){

      discoverpost.likedusersid = currentsid;
      var likeys = JSON.parse(discoverpost.likes);
      likeys += 1; 
      discoverpost.likes = likeys;
      // const res = document.getElementById("like-counter").textContent;
      // $('span#like-counter').text(JSON.parse(res) + 1);
      this.showToast('Liked Post');
      // this.isLiking==-1 
      // i=this.isLiking;
      // $('span.like-counter').text(response + " likes");
      // document.getElementById('like21');
      // $(".like21").addClass("hide");
      // $('.unlike').removeClass('hide');
    }else{
      this.showErrorToast('Error');
    }
  });

// var postid = $(this).data('likeid');
// 		const thispost = $(this);

    // console.log(discoverpost.postid);

			// $.ajax({
			// 	url: 'index.php',
			// 	type: 'post',
			// 	data: {
			// 		'liked': 1,
			// 		'postid': postid
			// 	},
			// 	success: function(response){
			// 		thispost.parent().find('span.likes_counter').text(response + " likes");
			// 		thispost.addClass('hide');
			// 		thispost.siblings().removeClass('hide');
			// 	}
			// });
  }

  unlike(postid, currentsid, discoverpost){
    let likePostData = {
      likedid: '',
      likedpostid: postid,
      likedusersid: currentsid,
      liked: '0',
    }

    const data = likePostData;
    console.log('likePostData: ' + JSON.stringify(data));

  //   this.dataService.getCheck(this.userid).subscribe(response => {
  //     if(response != null){  
  this.dataService.likes(data).subscribe(response => {
  if(response != null){

    // const res = document.getElementById("like-counter").textContent;
    // $('span#like-counter').text(JSON.parse(res) - 1);
    discoverpost.likedusersid = "";
    var likeys = JSON.parse(discoverpost.likes);
    likeys -= 1; 
    discoverpost.likes = likeys;

    this.showToast('Unliked Post');
    // $('span.like-counter').text(response + " likes");
    // document.getElementById('like21');
    // $(".like21").addClass("hide");
    // $('.unlike').removeClass('hide');
  }else{
    this.showErrorToast('Error');
  }
});
}

  async logout(){
  console.log("logging out");

  const storage = new Storage();
  await storage.create();

  await storage.set('usersid', '');
  await storage.set('userpassword', '');

  this.router.navigate(['/login']);
}

}
