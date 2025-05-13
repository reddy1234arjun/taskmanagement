from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from .database import Base

class TaskStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_on = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship with tasks
    tasks = relationship("Task", back_populates="creator")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    task_title = Column(String, nullable=False)
    task_description = Column(Text)
    task_due_date = Column(DateTime)
    task_status = Column(String, default=TaskStatus.pending)
    task_remarks = Column(Text)
    created_on = Column(DateTime(timezone=True), server_default=func.now())
    last_updated_on = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    created_by = Column(String)
    last_updated_by = Column(String)
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationship with user
    creator = relationship("User", back_populates="tasks")
