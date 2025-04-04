import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

// Creamos mocks simples para AuthService y Router
class MockAuthService {
  login(username: string, password: string) {
    return of({ access_token: 'fake-token' });
  }
}
class MockRouter {
  navigate(path: string[]) {}
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create el componente', () => {
    expect(component).toBeTruthy();
  });

  it('should login and navigate to home', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    component.username = 'test';
    component.password = 'test';
    component.login();

    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should display error message on login failure', () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'login').and.returnValue(throwError(() => new Error('Error en login')));
    
    component.login();
    
    expect(component.errorMessage).toBe('Error en login');
  });
});
