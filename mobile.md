For cross-platform mobility.

````css
//----------------------------------------------------

// landscape orientation
@media only screen and (min-width: 768px) {

}

// portrait orientation
@media only screen and (max-width: 768px) {
  #guestPage{
    padding-left: 2.5%;
    .six{
      width: 95% !important;
    }
    .doesnt-overlap-header{
      padding-top: 0px !important;
    }
  }
  .hidden-on-portrait{
    .hidden;
  }
  #footerActionBar{
    bottom: 0px;
  }

}
@media only screen and (max-width: 480px) {
}

````
