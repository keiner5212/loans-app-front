
export const openContent = (event: any, tabID: string) => {
    let i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].setAttribute("style", "display: none;");
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    const tab = document.getElementById(tabID);
    if (!tab) return;

    tab.style.display = "flex";
    event.currentTarget.className += " active";
  };
