
# ICI DRIVE

https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers

firebase functions:config:set elasticemail.url="https://api.elasticemail.com/v2/email/send" elasticemail.apikey="..."


Notifications

NEW ORDER
    ici_drive_customer_new_cart
        {maker_name}
        {order_link}

    ici_drive_maker_new_cart
        {order_link}

CONFIRMED
    ici_drive_maker_confirmed
        {when}
        {maker_place_label}
        {maker_place_address}
        {maker_phone}
        {payments_info}
            Vous avez opté pour le paiement via Paypal, veuillez ENVOYER via le site officielle Paypal la demande paiement au client :
            ff.fremont.florent@gmail.com
            Avec le message : "ici-drive réservation REF_330300304"
                OU
            Vous avez opté pour le paiement au moment du retrait de la marchandise, le client sera muni : d'une carte / d'especes

    ici_drive_customer_confirmed
        {maker_customer_phone}
        {when}
        {maker_place_label}
        {maker_place_address}
        {maker_phone}
        {google_maps}
        {payments_info}
            Le producteur ayant opté pour le paiement par PayPal, une demande de réglement vous sera adressée très prochainement.
            ou
            Le producteur ayant opté pour le paiement sur le lieu du retrait, veuillez vous munir lors du retrait : d'especes, d'une carte bancaire
        
    

CANCELLED
    ici_drive_annuler
        {order_link}
        {order_ref}
        {order_reasonOf​}

REFUSED
    ici_drive_refused
        {order_link}
        {order_ref}
        {order_reasonOf​}        

VERIFIED
    ici_drive_maker_verified
        {order_ref}
        {order_link}
    ici_drive_customer_verified
        {order_ref}
        {order_link}




Avant de venir récupérer votre commande, le producteur vous contactera pour régler via PAYPAL.ME la réserversation.