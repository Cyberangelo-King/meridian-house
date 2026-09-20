# ADR-001 — Static Prototype

## Context

The experience needs to be tested for narrative, interaction, information architecture, and visual language before committing to a larger application stack.

## Decision

The first implementation uses plain HTML, CSS, and JavaScript with Three.js loaded as a browser dependency.

## Consequence

The prototype is easy to inspect and deploy, but it does not yet provide the component system, asset pipeline, content model, or production-grade dependency management expected of the final build.
