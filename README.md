# ICI DRIVE

https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers



Notifications

POST /api/carts
    ici_drive_client_nouvelle-resa
        {maker_name}
        {order_link}

    ici_drive_producteur_nouvelle-resa
        {maker_firstname}
        {order_link}

ANNULATION ORDER
    ici_drive_producteur_annuler
        {maker_firstname}
        {order_link}
        {order_ref}
        {order_reasonOf​}

    ici_drive_client_annuler
        {order_link}
        {order_ref}
        {order_reasonOf​}

VALIDATION
    ici_drive_client_validee_paypal
        {order_ref}