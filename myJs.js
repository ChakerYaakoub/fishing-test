const myBtnSubmit = (e) => {
  e.preventDefault(); // Pour empêcher le comportement par défaut du bouton

  let password = document.getElementById("password").value;
  let username = document.getElementById("username").value;

  if (password && username) {
    console.log("the pass is : " + password + " username is : " + username);
    // we have now to send the username to the back end , le save and the redirect ver this page :

    //redirect test :
    window.location.href = "./AfterLogin.html";

    // setTimeout(
    //   () => {
    //     window.location.href = "./loginTest.html";
    //   },

    //   2000
    // );
    // the sate time out for testing password username variable
  } else {
    console.log("password and username are required");
  }
};
