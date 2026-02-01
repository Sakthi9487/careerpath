const select = document.getElementById("domainSelect");
const roadmaps = document.querySelectorAll(".roadmap");

select.addEventListener("change", function () {
  const selectedValue = this.value;

  roadmaps.forEach(r => r.classList.add("hidden"));

  if (selectedValue === "") return;

  const selectedRoadmap = document.getElementById(selectedValue);
  selectedRoadmap.classList.remove("hidden");

  
});