import { Component, OnInit } from '@angular/core';
import {
  AuthenticationService,
  FriendDetails,
  FriendshipDetails,
  TokenPayload,
  UserDetails,
} from '../authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  //La personne connectée
  userModel: UserDetails = {
    _id: '',
    email: '',
    name: '',
    role: '',
    friendships: [],
    exp: 0,
    iat: 0,
  };
  //la list du select d'ajout d'amis
  users: UserDetails[] = [];
  //le choix du select d'ajout d'amis
  newFriendModel: FriendDetails = { _id: '', relationship: '' };
  //les ids des relations de la personne connectée
  friendshipIds: string[] = [];
  //la list du select du role
  ROLES: string[] = [
    'Apprenti',
    'Guerrier',
    'Alchimiste',
    'Sorcier',
    'Espion',
    'Enchanteur',
  ];
  // la liste du select des relations
  RELATIONSHIPS: string[] = ['Famille', 'Amis', 'Collègue'];
  //le nouveau utilisateur
  newUserModel: TokenPayload = {
    email: '',
    name: '',
    password: '',
    relationship: '',
  };

  message: string = '';
  constructor(private auth: AuthenticationService) {}

  ngOnInit() {
    this.auth.profile().subscribe(
      (user) => {
        this.userModel = user;
      },
      (err) => {
        console.error(err);
      }
    );
    this.getUsers();
  }
  // Actualiser la liste des utilisateurs
  getUsers() {
    this.auth.users().subscribe(
      (users) => {
        const nonFriendUsers: UserDetails[] = [];

        users.map((user: UserDetails) => {
          if (
            this.userModel.friendships === null ||
            this.userModel.friendships.length === 0
          ) {
            nonFriendUsers.push(user);
          } else {
            let isFriend = false;
            this.userModel.friendships.map((friendship: FriendshipDetails) => {
              if (
                friendship.requester._id === user._id ||
                friendship.recipient._id === user._id
              ) {
                isFriend = true;
              }
            });
            if (!isFriend) {
              nonFriendUsers.push(user);
            }
          }
        });

        this.users = [...nonFriendUsers];
      },
      (err) => {
        console.error(err);
      }
    );
  }

  updateUser() {
    //créer une copie de this.userModel
    let data: any = { ...this.userModel };

    this.auth.updateUser(data).subscribe(
      (user) => {
        this.userModel = user;
        this.message = 'Profile mis à jour';
      },
      (err) => {
        console.error(err);
      }
    );
  }

  removeFriendship(id: string) {
    this.auth.deleteFriendship({ _id: id }).subscribe(
      (user) => {
        this.userModel = user;

        this.getUsers();
        this.message = 'Ami supprimé';
      },
      (err) => {
        console.error(err);
      }
    );
  }

  addFriend() {
    this.auth.addFriend(this.newFriendModel).subscribe(
      (user) => {
        this.userModel = user;
        this.newFriendModel = {
          _id: '',
          relationship: '',
        };
        this.getUsers();
        this.message = "Utilisateur ajouté à la liste d'amis";
      },

      (err) => {
        console.error(err);
      }
    );
  }

  createAndAddFriend() {
    console.log(this.newUserModel);
    this.auth.createAndAddFriend(this.newUserModel).subscribe(
      (user) => {
        this.userModel = user;
        this.newUserModel = {
          name: '',
          email: '',
          password: '',
          relationship: '',
        };
        this.getUsers();
        this.message = "Utilisateur créé et ajouté à la liste d'amis";
      },

      (err) => {
        console.error(err);
      }
    );
  }
}
