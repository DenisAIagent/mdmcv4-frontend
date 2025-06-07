@@ -0,0 +1,376 @@
importer  React ,  {  useState ,  useEffect ,  useRef  }  depuis  'react' ;
importer  {  useTranslation  }  depuis  'react-i18next' ;
importer  {  Lien  }  depuis  'react-router-dom' ;
importer  {  Note  }  depuis  'react-simple-star-rating' ;
importer  Modal  depuis  'react-modal' ;
importer  apiService  depuis  '../../services/api.service' ;
importer  '../../assets/styles/reviews.css' ;
importer  '../../assets/styles/modern-review-modal.css' ;

Modal . setAppElement ( '#root' ) ;

const  Avis  =  ( )  =>  {
  const  { t }  =  useTranslation ( ) ;
  const  [ activeIndex ,  setActiveIndex ]  =  useState ( 0 ) ;
  const  [ modalIsOpen ,  setModalIsOpen ]  =  useState ( false ) ;
  const  formRef  =  useRef ( null ) ;

  // États pour le formulaire
  const  [ nom ,  setName ]  =  useState ( '' ) ;
  const  [ email ,  setEmail ]  =  useState ( '' ) ;
  const  [ note ,  setRating ]  =  useState ( 0 ) ;
  const  [ message ,  setMessage ]  =  useState ( '' ) ;
  const  [ isSubmitting ,  setIsSubmitting ]  =  useState ( false ) ;
  const  [ formError ,  setFormError ]  =  useState ( null ) ;
  const  [ formSuccess ,  setFormSuccess ]  =  useState ( null ) ;
  const  [ formStep ,  setFormStep ]  =  useState ( 1 ) ;  // Pour l'expérience multi-étapes

  // États pour les avis approuvés
  const  [ approvedReviews ,  setApprovedReviews ]  =  useState ( [ ] ) ;
  const  [ isLoadingApproved ,  setIsLoadingApproved ]  =  useState ( true ) ;
  const  [ fetchApprovedError ,  setFetchApprovedError ]  =  useState ( null ) ;

  // Effet pour charger les avis approuvés
  useEffect ( ( )  =>  {
    const  fetchApprovedReviews  =  async  ( )  =>  {
      setIsLoadingApproved ( vrai ) ;
      setFetchApprovedError ( null ) ;

      essayer  {
        consoler . log ( 'Appel API pour avis approuvés via apiService' ) ;
        const  response  =  await  apiService . reviews . getReviews ( {  status : 'approuvé'  } ) ;

        si  ( Array . isArray ( response . data ) )  {
          setApprovedReviews ( réponse . données ) ;
          consoler . log ( 'Avis approuvés chargés :' ,  réponse . data ) ;
          définirActiveIndex ( 0 ) ;
        }  autre  {
          consoler . error ( 'La réponse de l\'API (avis approuvés) n\'a pas le format attendu :' ,  réponse ) ;
          setFetchApprovedError ( "Format de réponse API invalide." ) ;
        }
      }  catch  ( erreur )  {
        consoler . error ( "Erreur lors du fetch des avis approuvés:" ,  erreur ) ;
        setFetchApprovedError ( "Impossible de charger les avis approuvés." ) ;
      }  enfin  {
        setIsLoadingApproved ( faux ) ;
      }
    } ;

    récupérer les avis approuvés ( ) ;
  } ,  [ ] ) ;

  // Effet pour le carrousel
  useEffect ( ( )  =>  {
    si  ( approvedReviews . length  ===  0  ||  isLoadingApproved )  retour ;

     intervalle  constant =  setInterval ( ( )  =>  {
      setActiveIndex ( ( prevIndex )  =>  ( prevIndex  +  1 )  %  approvedReviews . length ) ;
    } ,  8000 ) ;

    return  ( )  =>  clearInterval ( intervalle ) ;
  } ,  [ approvedReviews ,  isLoadingApproved ] ) ;

  // Fonction pour afficher les étoiles
  const  renderDisplayStars  =  ( displayRating )  =>  {
    const  étoiles  =  [ ] ;
    pour  ( soit  i  =  1 ;  i  <=  5 ;  i ++ )  {
      étoiles . push ( < span  key = { i }  className = { `star ${ i  <=  displayRating ? 'filled' : 'empty' } ` } > ★ </ span > ) ;
    }
     étoiles de retour ;
  } ;

  // Fonction pour naviguer dans le carrousel
  const  goToReview  =  ( index )  =>  {
    setActiveIndex ( index ) ;
  } ;

  // Gestion du formulaire
  const  handleRating  =  ( taux )  =>  {
    setRating ( taux ) ;
  } ;

  const  validateStep  =  ( )  =>  {
    si  ( formStep  ===  1 )  {
      si  ( ! nom  ||  ! email )  {
        setFormError ( t ( 'reviews.form_error_required_fields' ) ) ;
        renvoie  faux ;
      }
      // E-mail de validation basique
      const  emailRegex  =  / ^ [ ^ \s @ ] + @ [ ^ \s @ ] + \. [ ^ \s @ ] + $ / ;
      si  ( ! emailRegex . test ( email ) )  {
        setFormError ( t ( 'reviews.form_error_invalid_email' ) ) ;
        renvoie  faux ;
      }
      setFormError ( null ) ;
      renvoie  vrai ;
    }  sinon si  ( formStep === 2 ) {    
      si  ( ! évaluation  ||  ! message )  {
        setFormError ( t ( 'reviews.form_error_required_fields' ) ) ;
        renvoie  faux ;
      }
      si  ( message . longueur  <  10 )  {
        setFormError ( t ( 'reviews.form_error_message_too_short' ) ) ;
        renvoie  faux ;
      }
      setFormError ( null ) ;
      renvoie  vrai ;
    }
    renvoie  vrai ;
  } ;

  const  nextStep  =  ( )  =>  {
    si  ( validateStep ( ) )  {
      setFormStep ( 2 ) ;
    }
  } ;

  const  prevStep  =  ( )  =>  {
    définirFormStep ( 1 ) ;
  } ;

  const  submitReview  =  async  ( e )  =>  {
    e . preventDefault ( ) ;

    si  ( ! validateStep ( ) )  {
      retour ;
    }

    setIsSubmitting ( vrai ) ;
    setFormError ( null ) ;

    essayer  {
      const  reviewData  =  {
        nom ,
        e-mail ,
        notation ,
        message
      } ;

      attendre  apiService . reviews . createReview ( reviewData ) ;

      // Réinitialiser le formulaire
      définir le nom ( '' ) ;
      définirEmail ( '' ) ;
      définirÉvaluation ( 0 ) ;
      définirMessage ( '' ) ;
      définirFormStep ( 1 ) ;

      setFormSuccess ( t ( 'avis.form_success' ) ) ;

      // Fermer la modale après un délai
      setTimeout ( ( )  =>  {
        closeModal ( ) ;
        setFormSuccess ( null ) ;
      } ,  3000 ) ;

    }  catch  ( erreur )  {
      consoler . error ( 'Erreur lors de la soumission de l\'avis:' ,  error ) ;
      setFormError ( t ( 'reviews.form_error_submit' ) ) ;
    }  enfin  {
      setIsSubmitting ( faux ) ;
    }
  } ;

  const  openModal  =  ( )  =>  {
    setModalIsOpen ( vrai ) ;
    setFormError ( null ) ;
    setFormSuccess ( null ) ;
    définirFormStep ( 1 ) ;
  } ;

  const  closeModal  =  ( )  =>  {
    setModalIsOpen ( faux ) ;
  } ;

  // Rendu JSX
  retour  (
    < section  id = "avis"  className = "avis-section" >
      < div  className = "conteneur" >
        < h2  className = "section-title" > { t ( 'reviews.title' ) } </ h2 >
        < p  className = "section-subtitle" > { t ( 'reviews.subtitle' ) } </ p >

        { /* Carrousel d'avis */ }
        < div  className = "reviews-container" >
          { est-ce que le chargement est approuvé ? (
            < div  className = "loading-spinner" > { t ( 'admin.loading' ) } </ div >
          ) : fetchApprovedError ? (
            < p  className = "message-d'erreur"  style = { { couleur : 'rouge' ,  textAlign : 'centre' } } > { fetchApprovedError } </ p >
          ) : approvedReviews . longueur  >  0 ? (
            < >
              < div  className = "avis-carrousel" >
                { approvedReviews . map ( ( review ,  index )  =>  (
                  < div  key = { review . _id }  className = { `review-card ${ index  ===  activeIndex ? 'active' : '' } ` }  style = { {  transform : `translateX( ${ ( index  -  activeIndex )  *  100 } %)`  } } >
                     < div  className = "en-tête-de-révision" >
                       < div  className = "review-avatar" >
                         < img  src = { review . avatar  ||  '/src/assets/images/avatars/default-avatar.png' }  alt = { `Avatar de ${ review . name } ` }  loading = "lazy"  onError = { ( e )  =>  {  e . target . onerror  =  null ;  e . target . src = '/src/assets/images/avatars/default-avatar.png' ;  } } />
                       </div>​​
                       < div  className = "review-info" >
                         < h3  className = "review-name" > { review . name } </ h3 >
                         { review . title  &&  < p  className = "review-role" > { review . title } </ p > }
                         < div  className = "évaluation-évaluation" >
                           { renderDisplayStars ( avis . note ) }
                         </div>​​
                       </div>​​
                     </div>​​
                     < div  className = "contenu-de-la-revue" >
                       < p  className = "texte-de-la-revue" > " { message . de la revue } " </ p >
                       < p  className = "review-date" > { new  Date ( review . createdAt ) . toLocaleDateString ( 'fr-FR' ) } </ p >
                     </div>​​
                  </div>​​
                ) ) }
              </div>​​
              < div  className = "avis-navigation" >
                { approvedReviews.map ( ( _ , index ) = > (​   
                  < touche  bouton = { index }  className = { `nav-dot ${ index  ===  activeIndex ? 'active' : '' } ` }  onClick = { ( )  =>  goToReview ( index ) }  aria-label = { ` ${ t ( 'reviews.go_to_review' ) }  ${ index  +  1 } ` }  />
                ) ) }
              </div>​​
            </ >
          ) : (
            < p  style = { { textAlign : 'center' } } > { t ( 'reviews.no_reviews' ) } </ p >
          ) }
        </div>​​

        { /* Boutons d'action */ }
        < div  className = "avis-actions" >
          < button  className = "btn btn-primary"  onClick = { openModal } > { t ( 'reviews.leave_review' ) } </ button >
          < Lien  vers = "/tous-les-avis"  className = "btn btn-secondary" > { t ( 'reviews.view_all' ) } </ Lien >
        </div>​​

        { /* Modale moderne pour laisser un avis */ }
        < Modal 
          estOuvert = { modalIsOpen } 
          onRequestClose = { closeModal }
          className = "modern-review-modal"
          overlayClassName = "overlay-review-moderne"
          contentLabel = { t ( 'reviews.leave_review' ) }
          closeTimeoutMS = { 300 }
        >
          < div  className = "en-tête-modal-moderne" >
            < h2 > { formStep  ===  1 ? t ( 'reviews.leave_review' ) : t ( 'reviews.rate_experience' ) } </ h2 >
            < button  className = "modern-modal-close"  onClick = { closeModal }  aria-label = "Fermer" > </ button >
          </div>​​

          < div  className = "modern-modal-body" >
            { formSuccess ? (
              < div  className = "modern-form-success" >
                { formSuccess }
              </div>​​
            ) : (
              < form  ref = { formRef }  onSubmit = { submitReview }  className = "modern-review-form" >
                { formError  &&  < div  className = "modern-form-error" > { formError } </ div > }

                { formStep  ===  1 ? (
                  < >
                    < div  className = "groupe-de-formulaires-modernes" >
                      < label  htmlFor = "name" > { t ( 'reviews.form_name' ) } </ label >
                      < entrée
                        type = "texte"
                        id = "nom"
                        className = "entrée de formulaire moderne"
                        valeur = { nom }
                        onChange = { ( e )  =>  setName ( e . target . value ) }
                        désactivé = { isSubmitting }
                        requis
                        espace réservé = { t ( 'reviews.form_name_placeholder' ) }
                      />
                    </div>​​

                    < div  className = "groupe-de-formulaires-modernes" >
                      < label  htmlFor = "email" > { t ( 'reviews.form_email' ) } </ label >
                      < entrée
                        type = "e-mail"
                        id = "email"
                        className = "entrée de formulaire moderne"
                        valeur = { email }
                        onChange = { ( e )  =>  setEmail ( e . target . value ) }
                        désactivé = { isSubmitting }
                        requis
                        espace réservé = { t ( 'reviews.form_email_placeholder' ) }
                      />
                    </div>​​

                    < div  className = "actions-de-formulaire-moderne" >
                      < bouton 
                        type = "bouton" 
                        className = "modern-btn modern-btn-secondaire" 
                        onClick = { closeModal }
                        désactivé = { isSubmitting }
                      >
                        { t ( 'common.cancel' ) }
                      </ bouton >
                      < bouton 
                        type = "bouton" 
                        className = "modern-btn modern-btn-primary"
                        onClick = { nextStep }
                        désactivé = { isSubmitting }
                      >
                        { t ( 'common.next' ) }
                      </ bouton >
                    </div>​​
                  </ >
                ) : (
                  < >
                    < div  className = "groupe-de-formulaires-modernes groupe-d'évaluation-moderne" >
                      < label > { t ( 'reviews.form_rating' ) } </ label >
                      < div  className = "étoiles-de-notation-modernes" >
                        < Note
                          onClick = { handleRating }
                          ratingValue = { note }
                          taille = { 35 }
                          transition
                          fillColor = "#ff3a3a"
                          emptyColor = "rgba(255, 255, 255, 0.2)"
                          className = "évaluation personnalisée"
                        />
                      </div>​​
                    </div>​​

                    < div  className = "groupe-de-formulaires-modernes" >
                      < label  htmlFor = "message" > { t ( 'reviews.form_message' ) } </ label >
                      < zone de texte
                        id = "message"
                        className = "entrée-de-formulaire-moderne zone-de-texte-de-formulaire-moderne"
                        valeur = { message }
                        onChange = { ( e )  =>  setMessage ( e . target . value ) }
                        désactivé = { isSubmitting }
                        requis
                        espace réservé = { t ( 'reviews.form_message_placeholder' ) }
                        lignes = { 5 }
                      />
                    </div>​​

                    < div  className = "actions-de-formulaire-moderne" >
                      < bouton 
                        type = "bouton" 
                        className = "modern-btn modern-btn-secondaire" 
                        onClick = { prevStep }
                        désactivé = { isSubmitting }
                      >
                        { t ( 'common.back' ) }
                      </ bouton >
                      < bouton 
                        type = "soumettre" 
                        className = "modern-btn modern-btn-primary"
                        désactivé = { isSubmitting }
                      >
                        { est-ce que je soumets ? (
                          < >
                            < span  className = "modern-loading-spinner" > </ span >
                            { t ( 'common.submitting' ) }
                          </ >
                        ) : t ( 'common.submit' ) }
                      </ bouton >
                    </div>​​
                  </ >
                ) }
              </formulaire>​​
            ) }
          </div>​​
        </ Modal >
      </div>​​
    </ section >
  ) ;
} ;

exportation  par défaut  Avis ;
