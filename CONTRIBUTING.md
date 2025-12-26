# Contributing to AsciiMe

First off, thank you for considering contributing to AsciiMe! It's people like you that make open source such a great community.

## Where do I go from here?

If you've noticed a bug or have a feature request, [make one](https://github.com/itsjustmithun/asciime/issues/new)! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

### Fork & create a branch

If this is something you think you can fix, then [fork AsciiMe](https://github.com/itsjustmithun/asciime/fork) and create a branch with a descriptive name.

A good branch name would be (where issue #123 is the ticket you're working on):

```sh
git checkout -b 123-add-a-new-feature
```

### Get the test suite running

Make sure you're able to run the tests. We've got some `npm` scripts to help you along:

- `npm test`: runs the complete test suite.

### Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first 😸

### Make a Pull Request

At this point, you should switch back to your main branch and make sure it's up to date with AsciiMe's main branch:

```sh
git remote add upstream git@github.com:itsjustmithun/asciime.git
git checkout main
git pull upstream main
```

Then update your feature branch from your local copy of main, and push it!

```sh
git checkout 123-add-a-new-feature
git rebase main
git push --force-with-lease origin 123-add-a-new-feature
```

Finally, go to GitHub and [make a Pull Request](https://github.com/itsjustmithun/asciime/compare)

### Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing and merging, check out this guide on [merging vs. rebasing](https://www.atlassian.com/git/tutorials/merging-vs-rebasing).

## How to get in touch

If you need help, you can ask on the [issue tracker](https://github.com/itsjustmithun/asciime/issues).

## Code of Conduct

Please be sure to read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).
