# Starwit's AI Cockpit

AI cockpit aims at building a human control interface to AI systems. It is supposed to cover requirements from EU's AI act. More details can be found at <https://www.kicockpit.eu/>. All shared components necessary for this repo can be found [here](https://github.com/KI-Cockpit/ai-cockpit-api). There you also can find more info about all other activities & results of this project.

This project was partly funded by the government of the federal republic of Germany. It is part of a research project aiming to keep _humans in command_ and is organized by the Federal Ministry of Labour and Social Affairs.

![BMAS](docs/imgs/BMAS_Logo.svg)

This software is __open source__ and it is intended to be used a large community of software developers, deployers and operators. Usage and modifications are strongly encouraged - see [contribution guide](CONTRIBUTION.MD) on how to get involved.

## Deployment

Cockpit is a part of a bundle of services. For deployment options see <https://github.com/starwit/ai-cockpit-deployment>

## Architecture & Concepts

AI Cockpit is composed by a number of components. The following diagram shows, how those components are working together.
Cockpit has three main interfaces:
* Decision - here a system landscape will announce results of interpreting a problem/anomaly
* Action - Operators can approve/disapprove proposed actions
* Transparency - every module making decisions or executing actions, has to register via this interface. Registration will cover all necessary information for deployer/operators.

![composition](./docs/imgs/Service-Composition-Architecture.drawio.svg)

Operational concepts are described [here](CONCEPTS.MD).

### Data Model

AI Cockpit needs a data model to collect system decisions and possible actions. Data definition are described [here](https://github.com/KI-Cockpit/ai-cockpit-api/blob/main/doc/domain-model.md#simplified-model).

## Development

For details on how to develop, build and run AI Cockpit see [development instructions](README-DEV.MD).

## License

Software in this repository is licensed under the AGPL-3.0 license. See [license agreement](LICENSE) for more details.
