# Schéma de la Base de Données - API Tisséa

Ce document présente le schéma de la base de données SQL utilisée pour l'API Tisséa.

## Modèles de Données

### Categories (Catégories de Transport)

| Champ       | Type     | Description                                   |
|-------------|----------|-----------------------------------------------|
| id          | INTEGER  | Identifiant unique (clé primaire)             |
| name        | STRING   | Nom de la catégorie (Bus, Métro, Tramway)     |
| description | TEXT     | Description de la catégorie                   |
| created_at  | DATETIME | Date de création                              |
| updated_at  | DATETIME | Date de dernière mise à jour                  |

### Lines (Lignes de Transport)

| Champ          | Type     | Description                                 |
|----------------|----------|---------------------------------------------|
| id             | INTEGER  | Identifiant unique (clé primaire)           |
| name           | STRING   | Nom de la ligne                             |
| number         | STRING   | Numéro de la ligne (ex: L1, B, 14)          |
| color          | STRING   | Couleur associée à la ligne                 |
| category_id    | INTEGER  | Clé étrangère vers la catégorie             |
| start_activity | TIME     | Heure de début d'activité quotidienne       |
| end_activity   | TIME     | Heure de fin d'activité quotidienne         |
| created_at     | DATETIME | Date de création                            |
| updated_at     | DATETIME | Date de dernière mise à jour                |

### Stops (Arrêts)

| Champ       | Type               | Description                         |
|-------------|-------------------|-------------------------------------|
| id          | INTEGER           | Identifiant unique (clé primaire)   |
| name        | STRING            | Nom de l'arrêt                      |
| latitude    | DECIMAL(10, 7)    | Latitude de l'arrêt                 |
| longitude   | DECIMAL(10, 7)    | Longitude de l'arrêt                |
| created_at  | DATETIME          | Date de création                    |
| updated_at  | DATETIME          | Date de dernière mise à jour        |

### LineStops (Table de liaison entre Lignes et Arrêts)

| Champ       | Type     | Description                                  |
|-------------|----------|----------------------------------------------|
| id          | INTEGER  | Identifiant unique (clé primaire)            |
| line_id     | INTEGER  | Clé étrangère vers la ligne                  |
| stop_id     | INTEGER  | Clé étrangère vers l'arrêt                   |
| stop_order  | INTEGER  | Ordre de l'arrêt sur la ligne                |
| created_at  | DATETIME | Date de création                             |
| updated_at  | DATETIME | Date de dernière mise à jour                 |

### Users (Utilisateurs)

| Champ       | Type                   | Description                     |
|-------------|------------------------|---------------------------------|
| id          | INTEGER                | Identifiant unique (clé primaire) |
| username    | STRING                 | Nom d'utilisateur               |
| email       | STRING                 | Adresse email                   |
| password    | STRING                 | Mot de passe hashé              |
| role        | ENUM('user', 'admin')  | Rôle de l'utilisateur           |
| created_at  | DATETIME               | Date de création                |
| updated_at  | DATETIME               | Date de dernière mise à jour    |

## Relations

1. **Category** (1) <-> (N) **Line**
   - Une catégorie peut avoir plusieurs lignes
   - Une ligne appartient à une seule catégorie

2. **Line** (N) <-> (M) **Stop** (via LineStop)
   - Une ligne peut avoir plusieurs arrêts
   - Un arrêt peut appartenir à plusieurs lignes
   - La table LineStop indique l'ordre des arrêts sur chaque ligne

## Diagramme Entité-Relation

```
+------------+       +------------+       +------------+
|            |       |            |       |            |
| Category   |1-----N| Line       |N-----M| Stop       |
|            |       |            |       |            |
+------------+       +------------+       +------------+
                          |
                          |
                          V
                    +------------+
                    |            |
                    | LineStop   |
                    |            |
                    +------------+

                    +------------+
                    |            |
                    | User       |
                    |            |
                    +------------+
```

Note: Ce schéma est également disponible dans un format plus détaillé dans le dossier /docs. 