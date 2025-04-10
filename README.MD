# Starwit's AI Cockpit

AI cockpit aims at building a human control interface to AI systems. It is supposed to cover requirements from EU's AI act. More details can be found at <https://www.kicockpit.eu/>. All shared components necessary for this repo can be found [here](https://github.com/KI-Cockpit/ai-cockpit-api). There you also can find more info about all other activities & results of this project.

This project was partly funded by the government of the federal republic of Germany. It is part of a research project aiming to keep _humans in command_ and is organized by the Federal Ministry of Labour and Social Affairs.

![BMAS](docs/imgs/BMAS_Logo.svg)

## Deployment

Cockpit is a part of a bundle of services. For deployment options see <https://github.com/starwit/ai-cockpit-deployment>

## Architecture & Concepts

AI Cockpit is composed by a number of components. The following diagram shows, how those components are working together.

![composition](./docs/imgs/Service-Composition-Architecture.drawio.svg)

### Data Model

AI Cockpit needs a data model to collect system decisions and their resulting actions. We are using an unified interface described [here](https://github.com/KI-Cockpit/ai-cockpit-api/blob/main/doc/domain-model.md#simplified-model)

## Development

For details on how to develop, build and run AI Cockpit see [development instructions](README-DEV.MD).

## License

Software in this repository is licensed under the AGPL-3.0 license. See [license agreement](LICENSE) for more details.
