from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_on: datetime

    class Config:
        orm_mode = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Task schemas
class TaskBase(BaseModel):
    task_title: str
    task_description: Optional[str] = None
    task_due_date: Optional[datetime] = None
    task_status: str = "pending"
    task_remarks: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    task_title: Optional[str] = None
    task_description: Optional[str] = None
    task_due_date: Optional[datetime] = None
    task_status: Optional[str] = None
    task_remarks: Optional[str] = None

class TaskResponse(TaskBase):
    id: int
    created_on: datetime
    last_updated_on: datetime
    created_by: str
    last_updated_by: str

    class Config:
        orm_mode = True
