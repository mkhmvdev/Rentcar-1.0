from django.urls import path

from .views import FaqListView, QuestionCreateView

urlpatterns = [
    path("faqs/", FaqListView.as_view(), name="faq-list"),
    path("questions/", QuestionCreateView.as_view(), name="question-create"),
]
