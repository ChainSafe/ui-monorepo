# Contributing

When contributing to this repository, please first check whether the issue you encounter or the request you have has already been logged. If not please create a New Issue.

## Logging an Issue

1. Make sure this issue has not already been raised. If a relevant issue has been closed already please reopen it or make a reference to it in a new issue.
1. Add appropriate labels to the issue (e.g. Documentation)
1. For minor issues, it is acceptable to describe the problem and offer a potential route to fix it. For more involved feature requests or bugs, please include the following details at the minimum:

##### For bugs:

- current system OS
- current browser user-agent and version
- repository branch
- steps to reproduce
- stack trace or any console log. Those logs are accessible in most browsers by pressing Ctrl/cmd + shift + J. 

##### For feature requests:

- rationale
- paint the feature step by step (in words)
- mockup (optional)

## Pull Request Process

1. Pick an issue in the Issue tracker for the repository, and assign yourself before working on it so we don't have duplicated effort.
1. Pull Request must be created against the `dev` branch.
1. The name of the branch should be in lower case and follow the pattern: [fix,mnt,feat]/[free-text-summarizing-the-PR]-[PR-number] e.g feat/mygithubhandle-file-sharing-888
    - "fix" should be used when the Pull Request fixes a bug or something that is broken
    - "mnt" should be used for any chore, dependency upgrade, housekeeping
    - "feat" should be used for a new feature

    You can optionally add your GitHub handle to identify branches.
1. If unsure about the specifics of implementing a particular issue, please make a Draft PR sooner rather than later, and start a discussion from there.
1. When designing a new UI component, please make sure your changes are also reflected in the appropriate Storybook story.
1. When merging a Pull Request, please make sure to squash and merge, to prevent having all the commit messages merged. Note: this is **not** the default behavior.
1. You may merge the Pull Request in once you have the sign-off of 2 maintainers, or if you
   do not have permission to do that, you may request the reviewer to merge it for you.

## Commit Messages

Please provide a meaningful message summarizing in a couple of words what the commit did.  

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to make participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic
  address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct, or to ban temporarily or permanently any contributor for other behaviors that they deem inappropriate, threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces when an individual is representing the project or its community. Examples of representing a project or community include using an official project e-mail address, posting via an official social media account or acting as an appointed representative at an online or offline event. Representation of a project may be further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing or otherwise unacceptable behavior may be reported by contacting the project team by logging an issue. All
complaints will be reviewed and investigated and will result in a response that is deemed necessary and appropriate to the circumstances. The project team is obligated to maintain confidentiality concerning the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/
[updateScripts]: https://gist.github.com/jacogr/9f0c8b33a7f14d944925787643dbf55b

## Styleguides

All TypeScript code must adhere to the [eslint-recommended](https://eslint.org/docs/rules/). These rules are programmatically enforced by `eslint` in a pre-push hook.
