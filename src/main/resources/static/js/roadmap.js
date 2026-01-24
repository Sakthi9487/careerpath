const select = document.getElementById("domainSelect");
const roadmaps = document.querySelectorAll(".roadmap");

select.addEventListener("change", function () {
  const selectedValue = this.value;

  // hide all roadmaps first
  roadmaps.forEach(r => r.classList.add("hidden"));

  // if no domain selected, stop
  if (selectedValue === "") return;

  // show selected roadmap
  const selectedRoadmap = document.getElementById(selectedValue);
  selectedRoadmap.classList.remove("hidden");

  
});