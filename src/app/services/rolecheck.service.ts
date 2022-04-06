import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root',
})
export class RoleCheckService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(public router: Router) {}

  getRole() {
    return localStorage.getItem('role');
  }

  getId() {
    return localStorage.getItem('userId');
  }
  get isAdmin(): boolean {
    const adminRole = localStorage.getItem('role');
    if (adminRole === 'admin') return true;
    return false;
  }
}
