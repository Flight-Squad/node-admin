# Source Code Organization

Interface Definitions:

-   `crm` -> Customer Relationship Management (Currently not in use)
-   `database` -> database CRUD & Search interfaces
-   `payment` -> Payment interfaces
-   `queue` -> queue interface

Entity Implementations (implementing Interfaces above):

-   `agents` -> Third-Party libraries and SDKs implemented according to interfaces above
-   `flightsquad` -> First-Party entities that depend on or connect to an `agent`
