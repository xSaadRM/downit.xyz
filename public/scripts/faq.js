// faq.js

document.addEventListener("DOMContentLoaded", function () {
  // Add event listeners for collapsible FAQs on small screens
  const faqItems = document.querySelectorAll("#faq li");

  faqItems.forEach((item) => {
    const question = item.querySelector("h4");
    const answer = item.querySelector("p");

    question.addEventListener("click", function () {
      answer.classList.toggle("show-answer");
    });
  });
});
