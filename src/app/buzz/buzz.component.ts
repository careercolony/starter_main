import { StorageService } from './../app-services/storage.service';
import { ApiService } from './../app-services/api.service';
import { ImageUploadService } from './../app-services/image-upload.service';
import { HttpClient } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { trigger, state, animate, transition, style, keyframes, query, stagger } from '@angular/animations';
//import { UserService } from '../services/user.service'
//import { ExperienceService } from '../services/experience.service'
import { Http, Response } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operator/first';
@Component({
  selector: 'buzz',
  templateUrl: './buzz.component.html',
  styleUrls: ['./buzz.component.css'],
  animations: [
    trigger('imganimate', [
      transition('* => *', [
        query('img', style({ opacity: 0})),

        query('img', stagger('60ms', [
          animate('600ms 1.3s ease-out', style({ opacity: 1}))
        ]))
      ])
    ]),

    trigger('page', [
      transition('* => *', [
        query('.page-content', style({ opacity: 0})),

        query('.page-content', stagger('30ms', [
          animate('600ms 1.7s ease-out', style({ opacity: 1}))
        ]))
      ])
    ]),


  ]
})
export class BuzzComponent implements OnInit {

@Input() myval
 result
 title
 //url =''
 base_url = 'https://api.embedly.com/1/oembed?'
 wee: any;

defaultImage: string = ''
fileToUpload: File = null

isShareLinkThought: boolean = false
isSharePhoto: boolean = false
isShareVideo: boolean = false
isShareDefault: boolean = true
 


  /*
  userDetails: any[]
  firstname
  lastname
  email
  memberID
  showSelected : boolean;

  public loginForm = this.fb.group({
    email: ["", Validators.required],
    profilephoto: ["", Validators.required],
    password: ["", Validators.required]
  });

  */
  
  private memberID;
  private userDetails
  private fname
  private addPostForm: FormGroup;


  private error;
  private post_result  
  public imageUrl = "assets/images/";
  private defaultAvatar = "assets/images/avatar-collection/009-user-1.png";
  
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private storageService: StorageService,
    private imageService: ImageUploadService,
    private http: HttpClient
  ) { 
    this.addPostForm = formBuilder.group({
      memberID: [null, Validators.required],
      title: [null]
    });

  }

  public onError(): void {
    this.imageUrl = this.defaultAvatar;
  } 
  ngOnInit() {
    this.memberID = this.storageService.get('memberID');
    this.fname = this.storageService.get('firstname');
    this.apiService.getProfileAvatar(this.memberID)
      .subscribe(
        (response) => {},
        (error) => {}
      );
    this.apiService.getProfileBackground(this.memberID)
      .subscribe(
        (response) => {
          
        },
        (error) => {}
      );

      this.apiService.getMyFriends(this.memberID)
      .subscribe(
        (response) => {
          console.log(response)
        },
        (error) => {}
      );

      this.apiService.getUserdetails(this.memberID)
      .subscribe(
        (response) => {
          console.log(response)
          this.userDetails = response[0]
        },
        (error) => {}
      );
  }

  onPaste(data:string){
    
    //d2f283608a3b4fa4a6ba77b522d4e26d
    let full_url = this.base_url+'url='+data+'&key=1d5c48f7edc34c54bdae4c37b681ea2b&autoplay=true'
    this.http.get(full_url) .subscribe(data => {
      this.result = data;
      console.log(this.result)
    

    });
  
  }


  handleFileInput(file: FileList){
    this.fileToUpload = file.item(0)
    var reader = new FileReader();
    reader.onload = (event:any) => {
      this.defaultImage = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
      console.log(this.fileToUpload)
  }
/** 
  onSubmitPost(memberID,title, description, firstname, lastname, provider_name, provider_url, type, url, image){
    this.imageService.postFile(memberID.value,title.value, description.value, firstname.value, lastname.value, provider_name.value, provider_url.value, type.value, url.value, this.fileToUpload )
    .subscribe( data =>{
      console.log(data);
      memberID.value = null
      title.value = null
      description.value = null
      image.value = null
      firstname.value = null
      lastname.value = null
      provider_name.value = null
      provider_url.value = null
      type.value = null

    })
  }
*/


  onSubmitArticle(memberID,title, description, provider_name, provider_url, type, url, html, image){
    this.imageService.addArticle(memberID.value, title.value, description.value, provider_name.value, provider_url.value, type.value, url.value, html, image )
    .subscribe( data =>{
      console.log(data);
      memberID.value = null
      title.value = null
      description.value = null
      provider_name.value = null
      provider_url.value = null
      type.value = null

    })
  }



  public addPost(data) {
    
    data['post_date'] = new Date().toUTCString();
    data['memberID'] = this.storageService.get('memberID');
    this.apiService.addPost(data).subscribe(
      (response) => {
        this.post_result = response[0];
        // this.message = 'Experience successfully added';

        console.log(response)
        
      },
      (error) => {
        if (error.status === 200 || error.status === 201) {
          // HTTP response was 200 but still if there is any error,
          // assuming it is json parser error, showing message as email already exist
          // console.log('Email already exist');
          this.error = '';
          // this.message = 'Experience successfully added';
          
        } else {
          // this.message = '';
          this.error = 'Error occurred while saving education';
          
        }
      }
    );
  }
}