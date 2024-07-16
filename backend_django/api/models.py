from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, cpf, email, sector, level, name, role, password=None):
        if not cpf:
            raise ValueError('O campo CPF é obrigatório')
        if not email:
            raise ValueError('O campo Email é obrigatório')

        user = self.model(
            cpf=cpf,
            email=self.normalize_email(email),
            sector=sector,
            level=level,
            name=name,
            role=role,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, cpf, email, sector, level, name, role, password):
        user = self.create_user(
            cpf=cpf,
            email=email,
            sector=sector,
            level=level,
            name=name,
            role=role,
            password=password,
        )
        user.is_admin = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    cpf = models.CharField(max_length=11, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    sector = models.CharField(max_length=100)
    level = models.IntegerField()
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'cpf'
    REQUIRED_FIELDS = ['email', 'sector', 'level', 'name', 'role']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin
