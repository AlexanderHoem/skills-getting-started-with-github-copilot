document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = renderActivityCard({
          name,
          description: details.description,
          participants: details.participants,
        });

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML += `
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  function renderActivityCard(activity) {
    const card = document.createElement('div');
    card.className = 'activity-card';

    const title = document.createElement('h4');
    title.textContent = activity.name;
    card.appendChild(title);

    const description = document.createElement('p');
    description.textContent = activity.description;
    card.appendChild(description);

    // Add participants section
    if (activity.participants && activity.participants.length > 0) {
      const participantsSection = document.createElement('div');
      participantsSection.className = 'participants';

      const participantsTitle = document.createElement('h5');
      participantsTitle.textContent = 'Participants:';
      participantsSection.appendChild(participantsTitle);

      const participantsList = document.createElement('ul');
      activity.participants.forEach(participant => {
        const listItem = document.createElement('li');
        listItem.textContent = participant;
        participantsList.appendChild(listItem);
      });
      participantsSection.appendChild(participantsList);

      card.appendChild(participantsSection);
    }

    return card;
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
