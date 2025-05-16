import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUsuariosComponent } from './admin-usuarios.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('AdminUsuariosComponent', () => {
  let component: AdminUsuariosComponent;
  let fixture: ComponentFixture<AdminUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUsuariosComponent, HttpClientTestingModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });
});
