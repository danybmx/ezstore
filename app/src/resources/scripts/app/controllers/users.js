module.exports = {
  usersController: function($scope, $q, api, $timeout) {
    // Default values
    $scope.action = 'list';
    $scope.subcation = null;
    $scope.loading = true;
    $scope.error = null;
    $scope.forms = {};

    // Data containers
    $scope.users = null;

    // Selected user container
    $scope.currentUser = null;
    $scope.currentUserIndex = null;
    $scope.currentAddress = null;

    // Datepicker Configuration
    $scope.bornDatePicker = {
      open: false,
    };
    $scope.dateOptions = {
      showWeeks: false,
      minDate: new Date(1900, 1, 1),
      maxDate: new Date(),
      startingDay: 1,
      datepickerMode: 'year',
      datepickerPopupTemplateUrl: 'templates/popup-datepicker.html',
    };

    // handleError
    const handleError = (err) => {
      if (err.data.reasons) {
        $scope.error = err.data.reasons;
      } else {
        $scope.error = err.data.message;
      }

      throw new Error(err.data.message);
    };

    // Loda data
    $scope.loadData = () => {
      // Load users
      api.users.all().then((res) => {
        $scope.users = res.data;
      }, (err) => {
        $scope.loading = false;
        $scope.users = null;
        handleError(err);
      });

      api.users.roles().then((res) => {
        $scope.loading = false;
        $scope.availableRoles = res.data;
      }, (err) => {
        $scope.loading = false;
        $scope.availableRoles = {};
        handleError(err);
      });
    };
    $scope.loadData();

    // isCurrentAction function
    $scope.isCurrentAction = (action) => {
      return $scope.action === action;
    };

    $scope.showList = () => {
      $scope.currentUserIndex = null;
      $scope.currentUser = null;
      $scope.action = 'list';
    };

    $scope.createUser = () => {
      $scope.action = 'create';
      $scope.currentUser = {
        address: {},
      };
    };

    // edit
    $scope.editUser = (index) => {
      $scope.currentUserIndex = index;
      $scope.currentUser = null;
      $scope.action = 'edit';

      $scope.loading = true;
      api.users.find($scope.users[index].id).then((response) => {
        $scope.currentUser = response.data;
        if ($scope.currentUser.bornDate) {
          $scope.currentUser.bornDate = new Date($scope.currentUser.bornDate);
        }
        if ($scope.currentUser.address === null) {
          $scope.currentUser.address = {};
        }
        $scope.loading = false;
      }, (err) => {
        $scope.loading = false;
        $scope.currentUser = null;
        $scope.currentUserIndex = null;
        handleError(err);
      });
    };

    // save
    $scope.saveUser = () => {
      const user = {
        firstName: $scope.currentUser.firstName,
        lastName: $scope.currentUser.lastName,
        email: $scope.currentUser.email,
        password: $scope.currentUser.password,
        phone: $scope.currentUser.phone,
        bornDate: $scope.currentUser.bornDate,
        vat: $scope.currentUser.vat,
        roles: $scope.currentUser.roles,
      };

      let defer;
      if ($scope.action === 'edit') {
        defer = api.users.update($scope.currentUser.id, user);
      } else {
        defer = api.users.create(user);
      }

      defer.then((res) => {
        if ($scope.action === 'edit') {
          $scope.users[$scope.currentUserIndex] = res.data;
        } else {
          $scope.users.push(res.data);
        }
        $scope.showList();
      }, (err) => {
        $scope.forms.userForm.$submitted = false;
        handleError(err);
      });
    };

    // deleteProduct
    $scope.deleteUser = (index) => {
      if (confirm('Are you sure?')) {
        $scope.loading = true;
        api.users.delete($scope.users[index].id).then((res) => {
          $scope.users.splice(index, 1);
          $scope.loading = false;
        }, (err) => {
          handleError(err);
        });
      };
    };

    // editUserAddresses
    $scope.editUserAddresses = (index) => {
      $scope.loading = true;
      $scope.currentUser = null;
      $scope.currentUserIndex = index;
      $scope.currentAddress = null;

      $scope.action = 'addresses';
      $scope.subaction = 'list';

      api.users.find($scope.users[index].id).then((res) => {
        $scope.currentUser = res.data;
        $scope.currentUser.defaultShippingAddressId = null;
        $scope.currentUser.defaultBillingAddressId = null;

        if (res.data.defaultShippingAddress) {
          $scope.currentUser.defaultShippingAddressId =
            res.data.defaultShippingAddress.id.toString();
        }
        if (res.data.defaultBillingAddress) {
          $scope.currentUser.defaultBillingAddressId =
            res.data.defaultBillingAddress.id.toString();
        }

        $scope.loading = false;
      }, (err) => {
        $scope.loading = false;
        handleError(err);
      });
    };

    $scope.showAddressesList = () => {
      $scope.currentAddress = null;
      $scope.subaction = 'list';
    };

    $scope.editAddress = (index) => {
      $scope.currentAddress = $scope.currentUser.addresses[index];
      $scope.subaction = 'edit';
    };

    $scope.addAddress = () => {
      $scope.currentAddress = {};
      $scope.subaction = 'create';
    };

    $scope.deleteAddress = (index) => {
      if (confirm('Are you sure?')) {
        const address = $scope.currentUser.addresses[index];
        $scope.loading = true;

        api.users.addresses.delete(
          $scope.currentUser.id,
          address.id
        ).then((res) => {
          $scope.currentUser.addresses.splice(index, 1);
          $scope.loading = false;
        }, (err) => {
          handleError(err);
        });
      }
    };

    $scope.saveAddress = () => {
      let defered;

      const address = {
        name: $scope.currentAddress.name,
        line1: $scope.currentAddress.line1,
        line2: $scope.currentAddress.line2,
        line3: $scope.currentAddress.line3,
        city: $scope.currentAddress.city,
        postalCode: $scope.currentAddress.postalCode,
        state: $scope.currentAddress.state,
        country: $scope.currentAddress.country,
      };
      if ($scope.subaction === 'create') {
        defered = api.users.addresses.create($scope.currentUser.id, address);
      } else if ($scope.subaction === 'edit') {
        defered = api.users.addresses.update(
          $scope.currentUser.id,
          $scope.currentAddress.id,
          address
        );
      }

      defered.then((res) => {
        $scope.currentAddress = null;
        $scope.editUserAddresses($scope.currentUserIndex);
      }, (err) => {
        handleError(err);
      });
    };

    $scope.updateDefaultBillingAddress = () => {
      api.users.addresses.setDefaultAddress(
        'billing',
        $scope.currentUser.id,
        $scope.currentUser.defaultBillingAddressId
      );
    };

    $scope.updateDefaultShippingAddress = () => {
      api.users.addresses.setDefaultAddress(
        'shipping',
        $scope.currentUser.id,
        $scope.currentUser.defaultShippingAddressId
      );
    };

    // formatAddress - Helper
    $scope.formatAddress = (address) => {
      const addressLines = [];

      addressLines.push(address.line1);
      if (address.line2) addressLines.push(address.line2);
      if (address.line3) addressLines.push(address.line3);

      let cityLine = address.city;
      if (address.postalCode) cityLine += ', ' + address.postalCode;
      if (address.state) cityLine += ', ' + address.state;
      addressLines.push(cityLine);

      addressLines.push(address.country);

      return addressLines.join(' / ');
    };
  },
};
